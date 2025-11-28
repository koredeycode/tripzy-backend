import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  body: z.object({
    amount: z.number({ message: "Amount must be a number" }),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),

    origin_address: z.string().min(1, "Origin address is required"),
    destination_address: z.string().min(1, "Destination address is required"),

    origin_latitude: z.number({ message: "Origin latitude must be a number" }),
    origin_longitude: z.number({
      message: "Origin longitude must be a number",
    }),
    destination_latitude: z.number({
      message: "Destination latitude must be a number",
    }),
    destination_longitude: z.number({
      message: "Destination longitude must be a number",
    }),

    ride_time: z.string().min(1, "Ride time is required"),
    driver_id: z.string().min(1, "Driver ID is required"),
    user_id: z.string().min(1, "User ID is required"),
  }),
});
