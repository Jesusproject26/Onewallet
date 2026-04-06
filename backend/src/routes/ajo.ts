import { Router } from "express";
import { query } from "../db";
import { AuthedRequest, requireAuth } from "./middleware";

const router = Router();

// create group
router.post("/groups", requireAuth, async (req: AuthedRequest, res) => {
  const { name, contributionAmount, cycleDays } = req.body;
  const result = await query<{ id: number }>(
    "INSERT INTO ajo_groups (name, contribution_amount, cycle_days) VALUES ($1, $2, $3) RETURNING id",
    [name, contributionAmount, cycleDays]
  );
  res.json({ groupId: result.rows[0].id });
});

// join group
router.post("/groups/:id/join", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const groupId = Number(req.params.id);

  const existing = await query(
    "SELECT id FROM ajo_members WHERE group_id = $1 AND user_id = $2",
    [groupId, userId]
  );
  if (existing.rows.length > 0) {
    return res.status(400).json({ message: "already a member" });
  }

  const posResult = await query<{ max: number }>(
    "SELECT COALESCE(MAX(position), 0) as max FROM ajo_members WHERE group_id = $1",
    [groupId]
  );
  const position = (posResult.rows[0].max || 0) + 1;

  await query(
    "INSERT INTO ajo_members (group_id, user_id, position) VALUES ($1, $2, $3)",
    [groupId, userId, position]
  );

  res.json({ message: "joined", position });
});

// list my groups
router.get("/my-groups", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const result = await query(
    `SELECT g.id, g.name, g.contribution_amount, g.cycle_days, m.position, m.has_received
     FROM ajo_groups g
     JOIN ajo_members m ON m.group_id = g.id
     WHERE m.user_id = $1`,
    [userId]
  );
  res.json(result.rows);
});
// Pay Ajo contribution
router.post("/groups/:id/pay", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const groupId = Number(req.params.id);
  const { amount, email } = req.body;

  // Get group info
  const group = await query(
    "SELECT contribution_amount FROM ajo_groups WHERE id = $1",
    [groupId]
  );

  if (group.rows.length === 0) {
    return res.status(404).json({ message: "Group not found" });
  }

  const contributionAmount = Number(group.rows[0].contribution_amount);

  if (amount !== contributionAmount) {
    return res.status(400).json({ message: "Invalid contribution amount" });
  }

  // Initialize Paystack
  const axios = require("axios");
  const paystack = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json"
    }
  });

  const init = await paystack.post("/transaction/initialize", {
    email,
    amount: amount * 100
  });

  res.json(init.data);
});

// Verify Ajo payment
router.get("/groups/:id/verify/:reference", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const groupId = Number(req.params.id);
  const { reference } = req.params;

  const axios = require("axios");
  const paystack = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json"
    }
  });

  const verify = await paystack.get(`/transaction/verify/${reference}`);
  const data = verify.data.data;

  if (data.status !== "success") {
    return res.json({ success: false });
  }

  const amount = data.amount / 100;

  // Log transaction
  await query(
    "INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, 'debit', $2, $3)",
    [userId, amount, `Ajo contribution for group ${groupId}`]
  );

  res.json({ success: true, amount });
});

export default router;
