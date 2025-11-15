// src/modules/stripe/stripe.controller.ts
import { Request, Response } from "express";
import * as stripeService from "./stripe.service";

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const result = await stripeService.createPaymentIntent(req.body);
    res.status(201).json({ data: result, message: "Payment intent created" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
