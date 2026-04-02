import jwt from 'jsonwebtoken';
import { Requester } from '../model/requester';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const JWT_EXPIRES_IN = '7d';

export function generateToken(payload: Requester): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): Requester {
  return jwt.verify(token, JWT_SECRET) as Requester;
}
