import { Router } from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/auth-controller';
import { ValidationMiddleware } from '../middlewares/validate-blog';
import { blacklistedSessions } from '../middlewares/session-blacklist';

const authRouter = Router();

// Removed Swagger comments for /auth/google and /auth/google/callback
authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth2 callback route
authRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout and blacklist session
 *     responses:
 *       200:
 *         description: Logged out
 */
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