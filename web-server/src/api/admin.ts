import type { Request, Response } from 'express';
import { config } from '../config.js';
import { ForbiddenError } from '../utils/custom-errors.js';
import { deleteUsers } from '../db/queries/users.js';

/**
 * Handler for the GET `/admin/metrics` path.
 * Reports the collected hit metrics.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export function handlerMetrics(_: Request, res: Response): void {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(
    `<html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
      </body>
    </html>`,
  );
}

/**
 * Handler for the POST `/admin/reset` path.
 * Resets the collected hit metrics & deletes all user records.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export async function handlerReset(_: Request, res: Response): Promise<void> {
  if (config.api.platform !== 'dev') {
    throw new ForbiddenError('Reset is only allowed in dev environment');
  }

  await deleteUsers();
  config.api.fileServerHits = 0;
  res.set('Content-Type', 'text/plain');
  res.write('Hits reset to 0');
  res.end();
}
