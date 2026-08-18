import process from 'node:process';
import type { NextFunction, Request, Response } from 'express';
import config from '../config.js';
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from '../utils/custom-errors.js';

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
    if (res.statusCode >= 300 && !process.env.TEST) {
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
  config.api.fileServerHits++;
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
  next: NextFunction,
): void {
  if (!process.env.TEST) {
    console.error(err);
  }

  if (err instanceof BadRequestError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: err.message });
  } else if (err instanceof ForbiddenError) {
    res.status(403).json({ error: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Something went wrong on our end' });
  }

  next();
}
