import { type NextFunction, type Request, type Response } from 'express';
import { config } from '../config.js';
import { getBearerToken, makeJWT } from '../utils/auth.js';
import { UnauthorizedError } from '../utils/custom-errors.js';
import { getRefreshTokenRecord, revokeRefreshToken } from '../db/queries/refreshTokens.js';

/**
 * TODO
 *
 * @param req 
 * @param res 
 * @param next 
 */
export function handlerRefresh(req: Request, res: Response, next: NextFunction): void {
  const token = getBearerToken(req);

  getRefreshTokenRecord(token)
    .then((result) => {
      if (!result || result.revokedAt || result.expiresAt < new Date()) {
        next(new UnauthorizedError('Not authorized'));
        return;
      }

      const jwt = makeJWT(result.userId, config.jwt.defaultDuration, config.jwt.secret);
      res.status(200).json({ token: jwt })
    })
    .catch(next)
}

/**
 * TODO
 *
 * @param req 
 * @param res 
 * @param next 
 */
export function handlerRevoke(req: Request, res: Response, next: NextFunction): void {
  const token = getBearerToken(req);

  revokeRefreshToken(token)
    .then(() => {
      res.status(204).end()
    })
    .catch(next);
}
