import { z } from 'zod';

// Shared password validation schema

export const passwordSchema = z.string({ error: 'Password is required' });

export const LoginSchema = {
  body: z.object({
    email: z.string({ error: 'Email is required' }).email({
      message: 'Invalid email address'
    }),

    password: passwordSchema
  })
};
