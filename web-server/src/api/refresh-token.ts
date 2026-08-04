import { type NextFunction, type Request, type Response } from 'express';
import { config } from '../config.js';
import { getBearerToken, makeJWT } from '../utils/auth.js';
import { UnauthorizedError } from '../utils/custom-errors.js';
import { getRefreshTokenRecord, revokeRefreshToken } from '../db/queries/refresh-tokens.js';

/**
 * Handler for the POST `/api/refresh` path.
 * Validates auth for the specified user info.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export function handlerRefresh(req: Request, res: Response, next: NextFunction): void {
  const token = getBearerToken(req);

  getRefreshTokenRecord(token)
    .then((result) => {
      if (!result || result.revokedAt || result.expiresAt < new Date()) {
        next(new UnauthorizedError('Invalid refresh token'));
        return;
      }

      const jwt = makeJWT(result.userId, config.jwt.defaultDuration, config.jwt.secret);
      res.status(200).json({ token: jwt })
    })
    .catch(next)
}

/**
 * Handler for the POST `/api/revoke` path.
 * Revokes the record for the specified token.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export function handlerRevoke(req: Request, res: Response, next: NextFunction): void {
  const token = getBearerToken(req);

  revokeRefreshToken(token)
    .then((result) => {
      if (!result) {
        throw new Error('Unable to revoke token');
      }

      res.status(204).end();
      next();
    })
    .catch(next);
}
