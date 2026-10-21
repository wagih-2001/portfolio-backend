import { z } from 'zod';
import {
  CreateProfileSchema,
  UpdateProfileSchema
} from './profile.validations';

export type ICreateProfileDTO = z.infer<typeof CreateProfileSchema.body>;
export type IUpdateProfileDTO = z.infer<typeof UpdateProfileSchema.body>;
