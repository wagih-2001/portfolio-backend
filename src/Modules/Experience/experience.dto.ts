import { z } from 'zod';
import { CreateExperienceSchema, UpdateExperienceSchema } from './experience.validations';


export type ICreateExperienceDTO = z.infer<typeof CreateExperienceSchema.body>;
export type IUpdateExperienceDTO = z.infer<typeof UpdateExperienceSchema.body>;
