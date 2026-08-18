import type { Request, Response } from 'express';

/**
 * Handler for the GET `/api/health` path.
 * Reports the health status of the API server.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 */
export function handlerReadiness(_: Request, res: Response): void {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send('OK');
}
