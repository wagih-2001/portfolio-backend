import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

export interface IImage {
  secure_url: string;
  public_id: string;
}

export enum ExperienceTypeEnum {
  FULL_TIME = 'Full Time',
  PART_TIME = 'Part Time',
  INTERNSHIP = 'Internship',
  FREELANCE = 'Freelance'
}

export enum ExperienceLocationEnum {
  HYBRID = 'Hybrid',
  REMOTE = 'Remote',
  ONSITE = 'Onsite'
}

export interface IExperience {
  _id: Types.ObjectId;
  company: string;
  companyWebsite?: string;
  companyLinkedIn?: string;
  position: string;
  image: IImage;
  type: ExperienceTypeEnum;
  location?: ExperienceLocationEnum;
  description: string;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>(
  {
    secure_url: {
      type: String,
      required: true
    },

    public_id: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
);

export const experienceSchema = new Schema<IExperience>(
  {
    company: {
      type: String,
      required: true,
      trim: true
    },

    companyWebsite: {
      type: String,
      trim: true
    },

    companyLinkedIn: {
      type: String,
      trim: true
    },

    position: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: imageSchema,
      required: true
    },

    type: {
      type: String,
      enum: Object.values(ExperienceTypeEnum),
      required: true
    },

    location: {
      type: String,
      enum: Object.values(ExperienceLocationEnum)
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      default: null
    },

    isCurrent: {
      type: Boolean,
      required: true,
      default: false
    },

    technologies: {
      type: [String],
      required: true
    }
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true
    }
  }
);

export const experienceModel: Model<IExperience> = model<IExperience>(
  'Experience',
  experienceSchema
);

export type HExperienceDocument = HydratedDocument<IExperience>;
