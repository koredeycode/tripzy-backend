import { Router } from "express";
import { createPaymentIntent, handleWebhook } from "./stripe.controller";

const router = Router();

router.post("/create", createPaymentIntent);
router.post("/webhook", handleWebhook);

export default router;
