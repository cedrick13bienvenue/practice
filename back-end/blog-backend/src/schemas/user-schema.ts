import Joi from 'joi';
import { Gender } from '../models/user-model';

export const RegisterUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string()
    .valid(...Object.values(Gender))
    .required(),
});

export const LoginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
