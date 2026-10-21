import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

export interface IImage {
  secure_url: string;
  public_id: string;
}

export interface IProject {
  _id: Types.ObjectId;
  title: string;
  description: string;
  image: IImage;
  technologies: string[];
  liveDemo?: string;
  github?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
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

export const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: imageSchema,
      required: true
    },

    technologies: {
      type: [String],
      required: true
    },

    liveDemo: {
      type: String,
      trim: true
    },
    deletedAt: {
      type: Date,
      default: null
    },
    github: {
      type: String,
      trim: true
    }
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

export const projectModel: Model<IProject> = model<IProject>(
  'Project',
  projectSchema
);

export type HProjectDocument = HydratedDocument<IProject>;
