import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db";
import { AuthedRequest, requireAuth } from "./middleware";

const router = Router();

// Set PIN
router.post("/set", requireAuth, async (req: AuthedRequest, res) => {
  const { pin } = req.body;
  const userId = req.userId!;

  if (!pin || pin.length < 4) {
    return res.status(400).json({ message: "Invalid PIN" });
  }

  const hash = await bcrypt.hash(pin, 10);

  await query("UPDATE users SET pin_hash = $1 WHERE id = $2", [hash, userId]);

  res.json({ success: true });
});

// Verify PIN
router.post("/verify", requireAuth, async (req: AuthedRequest, res) => {
  const { pin } = req.body;
  const userId = req.userId!;

  const result = await query("SELECT pin_hash FROM users WHERE id = $1", [userId]);

  if (!result.rows[0].pin_hash) {
    return res.status(400).json({ message: "PIN not set" });
  }

  const match = await bcrypt.compare(pin, result.rows[0].pin_hash);

  res.json({ success: match });
});

export default router;
