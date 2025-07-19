import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth-controller';
import { ValidationMiddleware } from '../middlewares/validate-blog';
import { RegisterUserSchema, LoginUserSchema } from '../schemas/user-schema';

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