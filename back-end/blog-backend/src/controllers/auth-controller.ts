import { Request, Response } from 'express';
import { UserModel } from '../models/user-model';
import { hashPassword } from '../utils/password';
import { ResponseService } from '../utils/response';

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
