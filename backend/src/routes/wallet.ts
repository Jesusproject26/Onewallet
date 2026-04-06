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
  router.get("/balance", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const result = await query("SELECT balance FROM wallets WHERE user_id = $1", [userId]);
  res.json({ balance: Number(result.rows[0].balance) });
});

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
router.get("/transactions", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const result = await query(
    `SELECT id, type, amount, description, created_at
     FROM transactions
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId]
  );
  res.json(result.rows);
});
router.post("/withdraw", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const balanceResult = await query<{ balance: string }>(
    "SELECT balance FROM wallets WHERE user_id = $1",
    [userId]
  );

  const balance = Number(balanceResult.rows[0].balance);

  if (balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  await query(
    "UPDATE wallets SET balance = balance - $1 WHERE user_id = $2",
    [amount, userId]
  );

  await query(
    "INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, 'debit', $2, $3)",
    [userId, amount, "Wallet withdrawal"]
  );

  res.json({ success: true, amount });
});

export default router;
