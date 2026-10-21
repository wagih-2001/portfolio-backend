import bcrypt from 'bcryptjs';
import { env } from '../../config/config.service';

const SALT_ROUNDS = Number(env.SALT_NUMBER);

export const generateHash = async (value: string): Promise<string> => {
  return bcrypt.hash(value, SALT_ROUNDS);
};

export const compareHash = async (
  value: string,
  hashedValue: string
): Promise<boolean> => {
  return bcrypt.compare(value, hashedValue);
};
