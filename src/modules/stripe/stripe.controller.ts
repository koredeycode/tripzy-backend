import { Request, Response } from "express";
import Stripe from "stripe";
import { env } from "../../config/env";
import { AuthRequest } from "../../middleware/authMiddleware";
import { createOrGetConversation } from "../chat/chat.service";
import { createRide } from "../ride/ride.service";
import * as stripeService from "./stripe.service";
import { stripe } from "./stripe.service";

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = { ...req.body, user_id: userId };
    const result = await stripeService.createPaymentIntent(data);
    res.status(201).json({ data: result, message: "Payment intent created" });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig || !env.STRIPE_WEBHOOK_SECRET) {
    res.status(400).send("Missing signature or webhook secret");
    return;
  }

  let event: Stripe.Event;

  try {
    // req.body must be raw buffer here
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("PaymentIntent was successful!", paymentIntent.id);

      const {
        origin_address,
        destination_address,
        origin_latitude,
        origin_longitude,
        destination_latitude,
        destination_longitude,
        ride_time,
        driver_id,
        user_id,
      } = paymentIntent.metadata;

      try {
        const ride = await createRide({
          origin_address,
          destination_address,
          origin_latitude: parseFloat(origin_latitude),
          origin_longitude: parseFloat(origin_longitude),
          destination_latitude: parseFloat(destination_latitude),
          destination_longitude: parseFloat(destination_longitude),
          ride_time: parseInt(ride_time),
          fare_price: paymentIntent.amount / 100,
          payment_status: "paid",
          driver_id: driver_id,
          user_id: user_id,
        });

        console.log("Ride created:", ride.ride_id);

        const conversation = await createOrGetConversation(user_id, driver_id);

        console.log("Conversation created:", conversation.id);
      } catch (error) {
        console.error("Error creating ride or conversation:", error);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
