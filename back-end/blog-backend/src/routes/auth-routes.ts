import { Router } from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/auth-controller';
import { ValidationMiddleware } from '../middlewares/validate-blog';

const authRouter = Router();

authRouter.post(
  '/register',
  // ValidationMiddleware({ type: 'body', schema: RegisterUserSchema }),
  registerUser
);

authRouter.post(
  '/login',
  // ValidationMiddleware({ type: 'body', schema: LoginUserSchema }),
  loginUser
);

// Google OAuth2 login route
authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth2 callback route
authRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

export default authRouter;