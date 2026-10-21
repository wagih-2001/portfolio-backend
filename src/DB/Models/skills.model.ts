import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

export interface IImage {
  secure_url: string;
  public_id: string;
}

export enum SkillCategoryEnum {
  Frontend = 'Frontend',
  Backend = 'Backend',
  Database = 'Database',
  Tools = 'Tools'
}

export interface ISkill {
  _id: Types.ObjectId;
  name: string;
  image: IImage;
  category: SkillCategoryEnum;
  order: number;
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

export const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: imageSchema,
      required: true
    },

    category: {
      type: String,
      enum: Object.values(SkillCategoryEnum),
      required: true
    },

    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

export const skillModel: Model<ISkill> = model<ISkill>('Skill', skillSchema);

export type HSkillDocument = HydratedDocument<ISkill>;
