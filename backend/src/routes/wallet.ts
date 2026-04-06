import { Router } from "express";
import { query } from "../db";
import { AuthedRequest, requireAuth } from "./middleware";

const router = Router();

router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const result = await query<{ balance: string }>(
    "SELECT balance FROM wallets WHERE user_id = $1",
    [userId]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "wallet not found" });
  }
  res.json({ balance: result.rows[0].balance });
});

// simple test top-up
router.post("/topup", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { amount } = req.body;
  await query("UPDATE wallets SET balance = balance + $1 WHERE user_id = $2", [
    amount,
    userId
  ]);
  await query(
    "INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, 'credit', $2, $3)",
    [userId, amount, "Test topup"]
  );
  res.json({ message: "topped up" });
});

export default router;
