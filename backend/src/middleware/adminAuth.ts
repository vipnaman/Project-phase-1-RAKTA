import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { errorResponse } from '../utils/apiResponse.js';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : '';

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { role?: string };
    if (payload.role !== 'ADMIN') throw new Error('Invalid role');
    next();
  } catch {
    res.status(401).json(errorResponse('ADMIN_AUTH_REQUIRED', 'A valid admin session is required.'));
  }
}
