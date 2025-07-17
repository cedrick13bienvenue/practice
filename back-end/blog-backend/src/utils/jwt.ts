import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (user: { id: string; email: string }): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    SECRET_KEY,
    { expiresIn: '1d' }
  );
};
