import { Router } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import { createPaymentIntent, handleWebhook } from "./stripe.controller";

const router = Router();

router.post("/create", authenticateToken, createPaymentIntent);
router.post("/webhook", handleWebhook);

export default router;
