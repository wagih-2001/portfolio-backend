import { z } from 'zod';
import { LoginSchema } from './auth.validations';

export type ILoginDTO = z.infer<typeof LoginSchema.body>;
