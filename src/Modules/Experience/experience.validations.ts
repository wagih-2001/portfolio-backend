import { z } from 'zod';

import {
  ExperienceLocationEnum,
  ExperienceTypeEnum
} from '../../DB/Models/experience.model';

export const CreateExperienceSchema = {
  body: z
    .object({
      company: z.string({ error: 'Company is required' }).min(1),

      companyWebsite: z.string().url('Invalid company website URL').optional(),

      companyLinkedIn: z
        .string()
        .url('Invalid company LinkedIn URL')
        .optional(),

      position: z.string({ error: 'Position is required' }).min(1),

      type: z.enum(ExperienceTypeEnum, {
        error: 'Invalid experience type'
      }),

      location: z
        .enum(ExperienceLocationEnum, {
          error: 'Invalid experience location'
        })
        .optional(),

      description: z.string({ error: 'Description is required' }).min(1),

      startDate: z.coerce.date({
        error: 'Start date is required'
      }),

      endDate: z.coerce.date().nullable().optional(),

      isCurrent: z.preprocess(value => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
      }, z.boolean().optional()),

      technologies: z.string({ error: 'Technologies are required' }).min(1)
    })
    .refine(
      data => {
        if (data.isCurrent) {
          return data.endDate === null || data.endDate === undefined;
        }

        return data.endDate !== null && data.endDate !== undefined;
      },
      {
        message:
          'endDate must be empty when current, and required when not current',
        path: ['endDate']
      }
    )
    .refine(
      data => {
        if (!data.endDate) return true;

        return data.endDate >= data.startDate;
      },
      {
        message: 'End date must be after start date',
        path: ['endDate']
      }
    )
};

export const UpdateExperienceSchema = {
  body: z
    .object({
      company: z.string().min(1).optional(),

      companyWebsite: z.string().url('Invalid company website URL').optional(),

      companyLinkedIn: z
        .string()
        .url('Invalid company LinkedIn URL')
        .optional(),

      position: z.string().min(1).optional(),

      type: z
        .enum(ExperienceTypeEnum, {
          error: 'Invalid experience type'
        })
        .optional(),

      location: z
        .enum(ExperienceLocationEnum, {
          error: 'Invalid experience location'
        })
        .optional(),

      description: z.string().min(1).optional(),

      startDate: z.coerce.date().optional(),

      endDate: z.coerce.date().nullable().optional(),

      isCurrent: z.boolean().optional(),

      technologies: z.string().min(1).optional()
    })
    .refine(
      data => {
        if (data.isCurrent === true) {
          return data.endDate === null || data.endDate === undefined;
        }

        return true;
      },
      {
        message: 'Current experience cannot have an end date',
        path: ['endDate']
      }
    )
};
