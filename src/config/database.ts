import mongoose from 'mongoose';
import { config } from './index';
import { logger } from '../utils/logger';
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.url);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
}; 