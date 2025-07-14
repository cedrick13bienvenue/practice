import express from 'express';
import cors from 'cors';
import blogRoutes from './routes/blog-routes';
import mongoose from 'mongoose';

const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.json());
app.use('/', blogRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at PORT:${PORT}`);
});

mongoose.connect('mongodb://localhost:27017/blogdb') // or your Atlas URI
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));
