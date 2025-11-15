// src/modules/stripe/stripe.service.ts
import Stripe from "stripe";
import { env } from "../../config/env";
import { AppError } from "../../middlewares/error.middleware";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

interface CreatePaymentIntentInput {
  name: string;
  email: string;
  amount: number;
}

export const createPaymentIntent = async (data: CreatePaymentIntentInput) => {
  const { name, email, amount } = data;

  // Validation
  if (!name || !email || !amount) {
    throw new AppError("Invalid parameters", 400);
  }

  // 1. Find or create customer
  let customer;
  try {
    const existingCustomer = await stripe.customers.list({ email });

    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
    } else {
      customer = await stripe.customers.create({ name, email });
    }
  } catch (err) {
    throw new AppError("Failed to create or fetch Stripe customer", 500);
  }

  // 2. Create ephemeral key
  let ephemeralKey;
  try {
    ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2025-10-29.clover" }
    );
  } catch (err) {
    throw new AppError("Failed to create ephemeral key", 500);
  }

  // 3. Create payment intent
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // cents
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });
  } catch (err) {
    throw new AppError("Failed to create payment intent", 500);
  }

  return {
    paymentIntent,
    ephemeralKey,
    customer: customer.id,
  };
};
