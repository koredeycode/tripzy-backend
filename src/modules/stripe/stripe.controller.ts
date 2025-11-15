import { Request, Response } from "express";
import * as stripeService from "./stripe.service";

export const createPaymentIntent = (req: Request, res: Response) => {
  const payment = stripeService.createPaymentIntent();
  res.json({ data: payment, message: "Payment intent created successfully" });
};
