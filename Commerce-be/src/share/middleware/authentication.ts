import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helper/token';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    (req as any).requester = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requester = (req as any).requester;

  if (!requester || requester.role !== 'admin') {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  next();
}
