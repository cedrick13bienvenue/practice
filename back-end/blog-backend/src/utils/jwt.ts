import jwt from 'jsonwebtoken';

export const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = ({_id, email, role}: { _id: string; email: string; role: string }): string => {
  return jwt.sign(
    {
      _id,
      email,
      role, 
    },
    SECRET_KEY,
    { expiresIn: '1d' }
  );
};
