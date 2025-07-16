import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db';
import { blogRouter } from './src/routes/blog-routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', blogRouter);

// Root route
app.get('/', (_req, res) => {
  res.send('📝 Blog API');
});

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
