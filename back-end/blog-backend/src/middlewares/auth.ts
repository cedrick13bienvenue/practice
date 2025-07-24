import { Request, Response, NextFunction } from 'express';
import { blacklistedSessions } from './session-blacklist';

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