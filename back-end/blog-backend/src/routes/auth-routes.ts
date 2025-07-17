import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth-controller';
import { ValidationMiddleware } from '../middlewares/validate-blog'; // reuse existing validation middleware
import { RegisterUserSchema, LoginUserSchema } from '../schemas/user-schema';
import { LoginSchema } from '../schemas/auth-schema';

export const authRouter = Router();

authRouter.post(
  '/register',
  ValidationMiddleware({ type: 'body', schema: RegisterUserSchema }),
  registerUser
);

authRouter.post(
  '/login',
  ValidationMiddleware({ type: 'body', schema: LoginUserSchema }),
  loginUser
);
authRouter.post('/login', ValidationMiddleware({ type: 'body', schema: LoginSchema }), loginUser);