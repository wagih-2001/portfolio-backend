import type { ZodError, ZodType } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../Utils/res/error.response';


type KeyReqType = 'body' | 'params' | 'query';

type SchemaType = Partial<Record<KeyReqType, ZodType>>;

export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: Array<{
      key: KeyReqType;
      issues: Array<{
        message: string;
        path: (string | number | symbol)[];
      }>;
    }> = [];

    for (const key of Object.keys(schema) as KeyReqType[]) {
      const keySchema = schema[key];

      if (!keySchema) continue;

      const validationResults = keySchema.safeParse(req[key]);

      if (!validationResults.success) {
        const zodError = validationResults.error as ZodError;

        validationErrors.push({
          key,
          issues: zodError.issues.map(issue => ({
            message: issue.message,
            path: issue.path
          }))
        });

        continue;
      }

     // For Search
       // req.query is read-only in Express,
       // so we cannot assign a new object directly to it.
       // Object.assign updates its existing values instead.

      if (key === 'query') {
        Object.assign(req.query, validationResults.data);
      } else {
        req[key] = validationResults.data;
      }
    }

    if (validationErrors.length > 0) {
      console.log(
        'Validation Errors:',
        JSON.stringify(validationErrors, null, 2)
      );

      return next(
        new BadRequestException('Validation Error', {
          cause: validationErrors
        })
      );
    }

    next();
  };
};
