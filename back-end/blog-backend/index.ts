import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db';
import { blogRouter } from './src/routes/blog-routes';
import { authRouter } from './src/routes/auth-routes';
import { commentRouter } from './src/routes/comment-routes';
import { likeRouter } from './src/routes/like-routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', blogRouter);
app.use('/api/auth', authRouter);
app.use('/api', commentRouter);
app.use('/api', likeRouter);

// Root route
app.get('/', (_req, res) => {
  res.send('📝 Blog API');
});

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});