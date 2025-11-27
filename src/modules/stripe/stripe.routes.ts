import { Router } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import { validateResource } from "../../middleware/validateResource";
import { createPaymentIntent, handleWebhook } from "./stripe.controller";
import { createPaymentIntentSchema } from "./stripe.schema";

const router = Router();

/**
 * @swagger
 * /stripe/create:
 *   post:
 *     summary: Create a payment intent
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in cents
 *               currency:
 *                 type: string
 *                 default: usd
 *     responses:
 *       200:
 *         description: Payment intent created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/create", authenticateToken, validateResource(createPaymentIntentSchema), createPaymentIntent);

/**
 * @swagger
 * /stripe/webhook:
 *   post:
 *     summary: Stripe webhook handler
 *     tags: [Stripe]
 *     description: Handles events from Stripe (e.g., payment_intent.succeeded)
 *     responses:
 *       200:
 *         description: Webhook received
 */
router.post("/webhook", handleWebhook);

export default router;
