import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

export interface Iuser {
  _id: Types.ObjectId;
  email: string;
  confirmEmailOTP?: string;
  confirmedAt?: Date;
  password: string;
  resetPasswordOTP?: string;
  createdAt: Date;
  updatedAt: Date;
  changeCredentialTime: Date | null;
}

export const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    confirmEmailOTP: {
      type: String
    },
    confirmedAt: {
      type: Date
    },
    changeCredentialTime: {
      type: Date,
      default: null
    },
    password: {
      type: String,
      required: true
    },
    resetPasswordOTP: {
      type: String
    }
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      // tranform => hide password
      transform: (doc, ret: Record<string, unknown>) => {
        delete ret.password;
        delete ret.confirmEmailOTP;
        delete ret.resetPasswordOTP;
        return ret;
      }
    }
  }
);

export const userModel: Model<Iuser> = model<Iuser>('user', userSchema);
export type HUserDocument = HydratedDocument<Iuser>;
