import type { NextFunction, Request, Response } from 'express';
import { errorResponse } from '../utils/apiResponse.js';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json(errorResponse('NOT_FOUND', 'Requested resource was not found.'));
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error.';

  res.status(statusCode).json(
    errorResponse(statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : err.code || 'ERROR', message),
  );
}
