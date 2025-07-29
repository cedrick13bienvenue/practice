import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './src/middlewares/google-auth'; // Register Google OAuth2 strategy
import session from 'express-session';
import passport from 'passport';
import { connectDB } from './src/config/db';
import { blogRouter } from './src/routes/blog-routes';
import authRouter from './src/routes/auth-routes';
import { commentRouter } from './src/routes/comment-routes';
import { likeRouter } from './src/routes/like-routes';
import { syncModels } from './src/models';
import { ensureAuthenticated } from './src/middlewares/auth';
import { swaggerSpec, swaggerUi } from './src/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());

// Session middleware (must come before passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', blogRouter);
app.use('/api/auth', authRouter);
app.use('/api', commentRouter);
app.use('/api', likeRouter);
app.use(authRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (_req, res) => {
  res.send('📝 Blog API');
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Export app for testing
export { app };

// Start server only if this file is run directly
if (require.main === module) {
  (async () => {
    await connectDB();
    await syncModels();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })();
}