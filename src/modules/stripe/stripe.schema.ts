import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  body: z.object({
    amount: z.number().min(1, 'Amount must be greater than 0'),
    currency: z.string().min(1, 'Currency is required'),
  }),
});
