import supertest from 'supertest';
import { Sequelize } from 'sequelize';
import { beforeAll, beforeEach, afterEach, afterAll, jest } from '@jest/globals';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { blogRouter } from '../src/routes/blog-routes';
import authRouter from '../src/routes/auth-routes';
import { commentRouter } from '../src/routes/comment-routes';
import { likeRouter } from '../src/routes/like-routes';
import { ensureAuthenticated } from '../src/middlewares/auth';
import { swaggerSpec, swaggerUi } from '../src/swagger';
import config from '../config/config';

dotenv.config();

// Create test app
const app = express();
const PORT = process.env.TEST_SERVER_PORT || 5501;

// Middleware
app.use(cors());
app.use(express.json());

// Session middleware (must come before passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'test-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', blogRouter);
app.use('/api/auth', authRouter);
app.use('/api', commentRouter);
app.use('/api', likeRouter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (_req, res) => {
  res.send('📝 Blog API Test');
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Test database configuration
const testDbConfig = config.test;

let sequelize: Sequelize;

export const request = supertest(app);
export const userResponse = {
  token: '',
  adminToken: '',
  userToken: '',
};
export const prefix = '/api/';

// Only setup database if we're running integration tests
const isIntegrationTest = process.argv.some(arg => 
  arg.includes('auth-test') || 
  arg.includes('blog-test') || 
  arg.includes('comment-test') || 
  arg.includes('like-test') ||
  arg.includes('user-test')
);

if (isIntegrationTest) {
  beforeAll(async () => {
    try {
      // Connect to test database
      sequelize = new Sequelize({
        ...testDbConfig,
        dialect: 'postgres',
      });
      
      await sequelize.authenticate();
      console.log('✅ Test Database Connected');
      
      // Import and sync models for testing
      const { syncModels } = await import('../src/models');
      await syncModels();
      console.log('✅ Test Database Models Synced');
      
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }, 15000);

  beforeEach(async () => {
    // Clear database before each test
    try {
      await sequelize.truncate({ cascade: true });
      console.log('🧹 Database cleared before test');
    } catch (error) {
      console.log('No tables to clear or tables already empty');
    }
  });

  afterAll(async () => {
    jest.clearAllMocks();
    if (sequelize) {
      await sequelize.close();
      console.log('🔌 Test Database Connection Closed');
    }
  });
}

afterEach(() => {
  jest.clearAllMocks();
}); 