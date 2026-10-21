import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

export interface IImage {
  secure_url: string;
  public_id: string;
}

export interface IProfile {
  _id: Types.ObjectId;

  name: string;
  headline: string;
  bio: string;

  image: IImage;

  email: string;
  location?: string;

  github?: string;
  linkedin?: string;

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

export const profileSchema = new Schema<IProfile>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    headline: {
      type: String,
      required: true,
      trim: true
    },

    bio: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: imageSchema,
      required: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    location: {
      type: String,
      trim: true
    },

    github: {
      type: String,
      trim: true
    },

    linkedin: {
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

export const profileModel: Model<IProfile> = model<IProfile>(
  'Profile',
  profileSchema
);

export type HProfileDocument = HydratedDocument<IProfile>;
