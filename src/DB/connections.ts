import mongoose from 'mongoose';
import { env } from '../config/config.service';

const connectDB = async () => {
  try {
    await mongoose.connect(env.DB_URL, {
      dbName: 'Portfolio_DB',
      serverSelectionTimeoutMS: 5000
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error(
      'Error connecting to MongoDB:',
      `${(error as Error).message}`
    );
    throw error;
  }
};

export default connectDB;
