import type { NextFunction, Request, Response } from 'express';
import { config } from '../config.js';

/**
 * Middleware function for logging non-ok status codes.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export function middlewareLogResponse(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.on('finish', () => {
    if (res.statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    }
  });
  next();
}

/**
 * Middleware function for tracking the number of requests to the server.
 *
 * @param _ - HTTP request object.
 * @param __ - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export function middlewareMetricsInc(
  _: Request,
  __: Response,
  next: NextFunction,
): void {
  config.fileServerHits++;
  next();
}

/**
 * Middleware function for handling errors.
 *
 * @param err - Error instance.
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export function middlewareErrorHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our end' });

  next(err);
}
