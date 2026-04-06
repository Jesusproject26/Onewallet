import { Router } from "express";
import axios from "axios";
import { query } from "../db";
import { AuthedRequest, requireAuth } from "./middleware";

const router = Router();

const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json"
  }
});

// Initialize payment
router.post("/initialize", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { amount, email } = req.body;

    const response = await paystack.post("/transaction/initialize", {
      email,
      amount: amount * 100 // Paystack uses kobo
    });

    res.json(response.data);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Paystack initialization failed" });
  }
});

// Verify payment
router.get("/verify/:reference", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { reference } = req.params;
    const userId = req.userId!;

    const response = await paystack.get(`/transaction/verify/${reference}`);

    const data = response.data.data;

    if (data.status === "success") {
      const amount = data.amount / 100;

      // Credit wallet
      await query(
        "UPDATE wallets SET balance = balance + $1 WHERE user_id = $2",
        [amount, userId]
      );

      await query(
        "INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, 'credit', $2, $3)",
        [userId, amount, "Paystack funding"]
      );

      return res.json({ success: true, amount });
    }

    res.json({ success: false, message: "Payment not successful" });
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Verification failed" });
  }
});

export default router;
