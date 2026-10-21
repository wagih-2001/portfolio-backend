import { z } from 'zod';
import { CreateProjectSchema, UpdateProjectSchema } from './project.validations';

export type ICreateDTO = z.infer<typeof CreateProjectSchema.body>;
export type IUpdateDTO = z.infer<typeof UpdateProjectSchema.body>;
