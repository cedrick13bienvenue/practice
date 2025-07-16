import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.h8zcdmw.mongodb.net/blog?retryWrites=true&w=majority`;
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export { connectDB };