import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const uri = 'mongodb+srv://<db_username>:<db_password>@cluster0.h8zcdmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const db_url = (): string => {
  const db_username = process.env.USERNAME!;
  const db_password = process.env.PASSWORD!;
  return uri.replace('<db_username>', db_username).replace('<db_password>', db_password);
};

export async function runDBConnection() {
  mongoose.connect(db_url())
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => console.error('❌ MongoDB connection failed:', err));
}

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .split(' ')
    .filter(word => word !== '')
    .join('-');
};
