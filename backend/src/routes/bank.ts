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

// Get list of banks
router.get("/banks", async (req, res) => {
  const banks = await paystack.get("/bank?country=nigeria");
  res.json(banks.data.data);
});

// Resolve account number
router.post("/resolve", async (req, res) => {
  const { account_number, bank_code } = req.body;

  const resolve = await paystack.get(
    `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`
  );

  res.json(resolve.data.data);
});

// Withdraw to bank
router.post("/withdraw", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { amount, account_number, bank_code, account_name } = req.body;

  // Check wallet balance
  const bal = await query("SELECT balance FROM wallets WHERE user_id = $1", [userId]);
  const balance = Number(bal.rows[0].balance);

  if (balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  // Create transfer recipient
  const recipient = await paystack.post("/transferrecipient", {
    type: "nuban",
    name: account_name,
    account_number,
    bank_code,
    currency: "NGN"
  });

  const recipientCode = recipient.data.data.recipient_code;

  // Initiate transfer
  const transfer = await paystack.post("/transfer", {
    amount: amount * 100,
    recipient: recipientCode,
    reason: "Wallet withdrawal"
  });

  // Deduct wallet
  await query("UPDATE wallets SET balance = balance - $1 WHERE user_id = $2", [
    amount,
    userId
  ]);

  // Log transaction
  await query(
    "INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, 'debit', $2, $3)",
    [userId, amount, "Bank withdrawal"]
  );

  res.json({ success: true, transfer: transfer.data.data });
});

export default router;
