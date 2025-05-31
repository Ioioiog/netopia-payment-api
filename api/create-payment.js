import { createPaymentForm } from "../lib/netopia.js";
import cors from "cors";

const allowCors = fn => async (req, res) => {
  const corsMiddleware = cors({
    origin: process.env.ALLOWED_ORIGINS.split(","),
    methods: ["POST"],
  });
  await new Promise(resolve => corsMiddleware(req, res, resolve));
  return fn(req, res);
};

export default allowCors(async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const data = req.body;
    const result = await createPaymentForm(data);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
