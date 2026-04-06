import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { json } from "body-parser";
import authRouter from "./routes/auth";
import walletRouter from "./routes/wallet";
import ajoRouter from "./routes/ajo";
import paystackRouter from "./routes/paystack";
import pinRouter from "./routes/pin";
app.use("/pin", pinRouter);
import bankRouter from "./routes/bank";
app.use("/bank", bankRouter);
import kycRouter from "./routes/kyc";
app.use("/kyc", kycRouter);

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "onewallet-backend" });
});

app.use("/auth", authRouter);
app.use("/wallet", walletRouter);
app.use("/ajo", ajoRouter);
app.use("/paystack", paystackRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
