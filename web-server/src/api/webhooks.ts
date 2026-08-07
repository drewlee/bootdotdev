import { type NextFunction, type Request, type Response } from 'express';
import { updateUserToChirpyRed } from '../db/queries/users.js';

/**
 * Handler for the POST `/api/polka/webhooks` path.
 * Upgrades the specified user to a Chirpy Red user.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export function handlerPolkaWebhook(req: Request, res: Response, next: NextFunction): void {
  type PolkaRequest = {
    event: string;
    data: {
      userId: string;
    };
  };

  const { event, data }: PolkaRequest = req.body;

  if (event !== 'user.upgraded' || !data || !data.userId) {
    res.status(204).end();
    next();
    return;
  }

  updateUserToChirpyRed(data.userId)
    .then((wasUpdated) => {
      if (!wasUpdated) {
        res.status(404).end();
        next();
        return;
      }

      res.status(204).end();
      next();
    })
    .catch(next)
}
