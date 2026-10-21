import { z } from 'zod';
import { CreateSkillsSchema, UpdateSkillSchema } from './skills.validations';

export type ICreateSkillDTO = z.infer<typeof CreateSkillsSchema.body>;

export type IUpdateSkillDTO = z.infer<typeof UpdateSkillSchema.body>;
