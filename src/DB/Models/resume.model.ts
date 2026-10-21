import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

export interface IResumeFile {
  secure_url: string;
  public_id: string;
}

export interface IResume {
  _id: Types.ObjectId;
  file: IResumeFile;
  createdAt: Date;
  updatedAt: Date;
}

const resumeFileSchema = new Schema<IResumeFile>(
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

export const resumeSchema = new Schema<IResume>(
  {
    file: {
      type: resumeFileSchema,
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

export const resumeModel: Model<IResume> = model<IResume>(
  'Resume',
  resumeSchema
);

export type HResumeDocument = HydratedDocument<IResume>;
