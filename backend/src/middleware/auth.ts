import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { errorResponse } from '../utils/apiResponse.js';

export type AuthenticatedRequest = Request & { user?: { id: string; role: string; email?: string } };

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : '';

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub?: string; role?: string; email?: string };
    if (!payload.sub) throw new Error('Invalid subject');
    req.user = { id: payload.sub, role: payload.role || 'USER', email: payload.email };
    next();
  } catch {
    res.status(401).json(errorResponse('AUTH_REQUIRED', 'A valid login session is required.'));
  }
}
