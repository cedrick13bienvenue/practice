import { Router } from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/auth-controller';
import { ValidationMiddleware } from '../middlewares/validate-blog';
import { blacklistedSessions } from '../middlewares/session-blacklist';

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

export default authRouter;