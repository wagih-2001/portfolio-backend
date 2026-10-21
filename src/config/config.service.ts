import { resolve } from 'node:path';

import { config } from 'dotenv';
config({ path: resolve('./config/dev.env') });

export const env = {
  PORT: Number(process.env.PORT) || 8000,
  MODE: process.env.MODE as string,
  DB_URL: process.env.DB_URI as string,

  //hash
  SALT_NUMBER: Number(process.env.SALT_NUMBER) || 12,

  // JWT
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,

  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || 3600,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || 604800,

  //signup
  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string
};
export type env = typeof env;
