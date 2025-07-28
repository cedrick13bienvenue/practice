import { Router } from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/auth-controller';
import { ValidationMiddleware } from '../middlewares/validate-blog';
import { blacklistedSessions } from '../middlewares/session-blacklist';
import { generateToken } from '../utils/jwt';

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication and OAuth2 routes
 *
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Start Google OAuth2 login
 *     responses:
 *       302:
 *         description: Redirects to Google login
 *
 * /auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Google OAuth2 callback
 *     responses:
 *       302:
 *         description: Redirects to dashboard after successful login
 *
 * /logout:
 *   get:
 *     tags: [Auth]
 *     summary: Logout and blacklist session
 *     responses:
 *       200:
 *         description: Logged out
 *
 * /register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Check authentication status
authRouter.get('/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user as any;
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    return res.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  }
  res.json({
    success: false,
    authenticated: false,
    message: 'Not authenticated'
  });
});

// Google OAuth2 callback route
authRouter.get(
  '/auth/google/callback',
  (req, res, next) => {
    // Check if user is already authenticated (prevents refresh issues)
    if (req.isAuthenticated()) {
      const user = req.user as any;
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });
      return res.json({
        success: true,
        message: 'Already authenticated',
        token
      });
    }
    next();
  },
  passport.authenticate('google', { 
    failureRedirect: '/auth/google/failure',
    failureFlash: true 
  }),
  (req, res) => {
    const user = req.user as any;
    if (!user) {
      return res.status(401).json({ message: 'User not found after Google login' });
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    res.json({
      success: true,
      message: 'Google login successful',
      token
    });
  }
);

// OAuth2 failure route
authRouter.get('/auth/google/failure', (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Google OAuth2 authentication failed. Please try again.'
  });
});

// Logout route with session blacklisting
authRouter.get('/logout', (req, res) => {
  if (req.session) {
    blacklistedSessions.add(req.sessionID);
    req.logout(() => {
      req.session?.destroy(() => {
        res.send('Logged out');
      });
    });
  } else {
    res.send('No session');
  }
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout user and blacklist session/token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
authRouter.post(
  '/register',
  // ValidationMiddleware({ type: 'body', schema: RegisterUserSchema }),
  registerUser
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
authRouter.post(
  '/login',
  // ValidationMiddleware({ type: 'body', schema: LoginUserSchema }),
  loginUser
);

export default authRouter;