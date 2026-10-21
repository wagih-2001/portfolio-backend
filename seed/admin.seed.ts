import mongoose from 'mongoose';

import { userModel } from '../src/DB/Models/user.model';
import { env } from '../src/config/config.service';
import { generateHash } from '../src/Utils/security/hashing.security';

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.DB_URL);

    const existingAdmin = await userModel.findOne({
      email: env.ADMIN_EMAIL
    });

    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await generateHash(env.ADMIN_PASSWORD);

    await userModel.create({
      email: env.ADMIN_EMAIL,
      password: hashedPassword
    });

    console.log('Admin created successfully');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
