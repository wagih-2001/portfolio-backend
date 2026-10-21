import { z } from 'zod';

export const CreateProjectSchema = {
  body: z.object({
    title: z.string({ error: 'Title is required' }).min(1),
    description: z.string({ error: 'Description is required' }).min(1),
    technologies: z.string({ error: 'Technologies is required' }).min(1),
    liveDemo: z.string().optional(),
    github: z.string().optional()
  })
};
export const UpdateProjectSchema = {
  body: z.object({
    title: z.string({ error: 'Title is required' }).min(1).optional(),
    description: z
      .string({ error: 'Description is required' })
      .min(1)
      .optional(),
    technologies: z
      .string({ error: 'Technologies is required' })
      .min(1)
      .optional(),
    liveDemo: z.string().optional(),
    github: z.string().optional()
  })
};
