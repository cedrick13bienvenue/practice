import { Request, Response, NextFunction } from 'express';
import { blacklistedSessions } from './session-blacklist';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../utils/jwt';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (
    typeof req.isAuthenticated === 'function' &&
    req.isAuthenticated() &&
    !blacklistedSessions.has(req.sessionID)
  ) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

// JWT Authentication middleware for API requests
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as any;
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
} 