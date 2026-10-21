import { z } from 'zod';

export const CreateProfileSchema = {
  body: z.object({
    name: z
      .string({
        error: 'Name is required'
      })
      .min(1, 'Name is required'),

    headline: z
      .string({
        error: 'Headline is required'
      })
      .min(1, 'Headline is required'),

    bio: z
      .string({
        error: 'Bio is required'
      })
      .min(1, 'Bio is required'),

    email: z
      .string({
        error: 'Email is required'
      })
      .email('Invalid email'),

    location: z.string().min(1).optional(),

    github: z.string().url('Invalid GitHub URL').optional(),

    linkedin: z.string().url('Invalid LinkedIn URL').optional()
  })
};

export const UpdateProfileSchema = {
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),

    headline: z.string().min(1, 'Headline cannot be empty').optional(),

    bio: z.string().min(1, 'Bio cannot be empty').optional(),

    email: z.string().email('Invalid email').optional(),

    location: z.string().min(1).optional(),

    github: z.string().url('Invalid GitHub URL').optional(),

    linkedin: z.string().url('Invalid LinkedIn URL').optional()
  })
};
