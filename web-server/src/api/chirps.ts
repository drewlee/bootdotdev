import { type NextFunction, type Request, type Response } from 'express';
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/custom-errors.js';
import { cleanWords } from '../utils/clean-words.js';
import {
  createChirp,
  deleteChirp,
  getAllChirps,
  getChirpById,
  getChirpsByUserId
} from '../db/queries/chirps.js';
import { getBearerToken, validateJWT } from '../utils/auth.js';
import { config } from '../config.js';

/**
 * Handler for the POST `/api/chirps` path.
 * Creates a new record for the specified chirp.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export function handlerCreateChirp(req: Request, res: Response, next: NextFunction): void {
  const { body }: { body: string } = req.body;
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);

  if (!body) {
    next(new BadRequestError('Missing required property'));
    return;
  }

  if (body.length > 140) {
    next(new BadRequestError('Chirp is too long. Max length is 140'));
    return;
  }

  const cleanedBody = cleanWords(body);

  createChirp({ body: cleanedBody, userId })
    .then((chirp) => {
      if (!chirp) {
        throw new Error('Failed to create new chirp');
      }

      res.status(201).json(chirp);
      next();
    })
    .catch(next);
}

/**
 * Handler for the GET `/api/chirps` path.
 * Retrieves all chirps.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export function handlerGetAllChirps(req: Request, res: Response, next: NextFunction): void {
  const authorId = req.query.authorId;

  if (typeof authorId === 'string' && authorId !== '') {
    getChirpsByUserId(authorId)
      .then((chirps) => {
        res.status(200).json(chirps);
      })
      .catch(next);

    return;
  }

  getAllChirps()
    .then((chirps) => {
      res.status(200).json(chirps);
    })
    .catch(next);
}

/**
 * Handler for the GET `/api/chirps/:chirpId` path.
 * Retrieves all chirps.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export function handlerGetChirp(req: Request, res: Response, next: NextFunction): void {
  let { chirpId } = req.params;

  if (Array.isArray(chirpId)) {
    chirpId = chirpId[0];
  }

  getChirpById(chirpId)
    .then((chirp) => {
      if (!chirp) {
        next(new NotFoundError('Chirp not found for the corresponding id'));
        return;
      }

      res.status(200).json(chirp);
      next();
    })
    .catch(next);
}

/**
 * Handler for the DELETE `/api/chirps/:chirpId` path.
 * Deletes the record for the specified chirp by its id.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export function handlerDeleteChirp(req: Request, res: Response, next: NextFunction): void {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);
  let { chirpId } = req.params;

  if (Array.isArray(chirpId)) {
    chirpId = chirpId[0];
  }

  getChirpById(chirpId)
    .then((chirp) => {
      if (!chirp) {
        next(new NotFoundError('Chirp not found for the corresponding id'));
        return;
      }

      if (chirp.userId !== userId) {
        next(new ForbiddenError('Not authorized to delete chirp'));
        return;
      }

      return deleteChirp(chirpId);
    })
    .then(() => {
      res.status(204).end()
    })
    .catch(next);
}
