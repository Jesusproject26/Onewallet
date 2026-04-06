import { Router } from "express";
import { query } from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

function signToken(userId: number) {
  const secret = process.env.JWT_SECRET || "devsecret";
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  try {
    const { phone, nin, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: "phone and password required" });
    }

    const existing = await query("SELECT id FROM users WHERE phone = $1", [phone]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "phone already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await query<{ id: number }>(
      "INSERT INTO users (phone, nin, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [phone, nin || null, hash]
    );

    const userId = result.rows[0].id;

    await query("INSERT INTO wallets (user_id, balance) VALUES ($1, 0)", [userId]);

    const token = signToken(userId);
    res.json({ token, userId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const result = await query<{ id: number; password_hash: string }>(
      "SELECT id, password_hash FROM users WHERE phone = $1",
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = signToken(user.id);
    res.json({ token, userId: user.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "server error" });
  }
});

export default router;
