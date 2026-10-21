import { z } from 'zod';
import { SkillCategoryEnum } from '../../DB/Models/skills.model';

export const CreateSkillsSchema = {
  body: z.object({
    name: z.string({ error: 'Skills name is required' }).min(1),
    category: z.enum(SkillCategoryEnum, {
      error: 'Invalid skill category'
    }),
    order: z.coerce.number().int().min(0).optional()
  })
};
export const UpdateSkillSchema = {
  body: z.object({
    name: z.string().min(1).optional(),
    category: z
      .enum(SkillCategoryEnum, {
        error: 'Invalid skill category'
      })
      .optional(),
    order: z.coerce.number().int().min(0).optional()
  })
};
