import { Router } from "express";
import { query } from "../db";
import { AuthedRequest, requireAuth } from "./middleware";

const router = Router();

// Submit KYC
router.post("/submit", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;
  const { id_type, id_number, id_image, selfie_image } = req.body;

  await query(
    `INSERT INTO kyc (user_id, id_type, id_number, id_image, selfie_image)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, id_type, id_number, id_image, selfie_image]
  );

  res.json({ success: true });
});

// Get KYC status
router.get("/status", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId!;

  const result = await query(
    "SELECT status FROM kyc WHERE user_id = $1 ORDER BY id DESC LIMIT 1",
    [userId]
  );

  if (result.rows.length === 0) {
    return res.json({ status: "not_submitted" });
  }

  res.json({ status: result.rows[0].status });
});

export default router;
