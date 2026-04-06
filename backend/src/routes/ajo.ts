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

export default router;
