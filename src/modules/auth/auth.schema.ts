import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    profile_image_url: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});
