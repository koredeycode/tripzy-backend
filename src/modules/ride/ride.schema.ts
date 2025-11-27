import { z } from 'zod';

export const createRideSchema = z.object({
  body: z.object({
    origin_address: z.string().min(1, 'Origin address is required'),
    destination_address: z.string().min(1, 'Destination address is required'),
    origin_latitude: z.number(),
    origin_longitude: z.number(),
    destination_latitude: z.number(),
    destination_longitude: z.number(),
    ride_time: z.number(),
    fare_price: z.number(),
    payment_status: z.string().min(1, 'Payment status is required'),
    driver_id: z.string().uuid('Invalid driver ID'),
  }),
});
