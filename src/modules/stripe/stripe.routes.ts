import { Router } from "express";
import { createPaymentIntent } from "./stripe.controller";

const router = Router();

router.post("/create", createPaymentIntent);

export default router;
