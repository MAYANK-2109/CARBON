/**
 * @module middleware/http-logger
 * @description Logs every inbound HTTP request with method, path, status, duration, and request ID.
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function httpLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    logger[level](`${req.method} ${req.path} ${res.statusCode}`, {
      requestId: req.id,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  next();
}
