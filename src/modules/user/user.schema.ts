import { z } from 'zod';

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    profile_image_url: z.string().optional(),
  }),
});
