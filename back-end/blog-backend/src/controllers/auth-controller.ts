import { Request, Response } from 'express';
import { UserModel } from '../models/user-model';
import { hashPassword } from '../utils/password';
import { ResponseService } from '../utils/response';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, gender } = req.body;

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return ResponseService({
        res,
        status: 400,
        success: false,
        message: 'Email already in use',
      });
    }

    const hashed = await hashPassword(password);

    const newUser = new UserModel({
      name,
      email,
      password: hashed,
      gender,
      isActive: true,
    });

    await newUser.save();

    ResponseService({
      res,
      status: 201,
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    ResponseService({
      res,
      status: 500,
      success: false,
      message: (error as Error).message,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return ResponseService({
        res,
        status: 401,
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return ResponseService({
        res,
        status: 401,
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken({
    _id: user._id.toString(),
    email: user.email,
    role: user.role, 
  });

    ResponseService({
      res,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    ResponseService({
      res,
      status: 500,
      success: false,
      message: (error as Error).message,
    });
  }
};