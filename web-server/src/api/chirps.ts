import { type NextFunction, type Request, type Response } from 'express';
import { SORT_OPTIONS, type SortOption } from '../types/index.js';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../utils/custom-errors.js';
import { cleanWords } from '../utils/clean-words.js';
import {
  createChirp,
  deleteChirp,
  getAllChirps,
  getChirpById,
  getChirpsByUserId,
} from '../db/queries/chirps.js';
import { getBearerToken, validateJWT } from '../utils/auth.js';
import config from '../config.js';

/**
 * Validates and returns the corresponding sorting order from the given parameter.
 *
 * @param sortOrder - Potential sort order value to validate.
 * @returns Sorting order value.
 */
function getSortOrder(sortOrder: unknown): SortOption {
  if (typeof sortOrder === 'string') {
    const tSort = sortOrder as SortOption;
    if (SORT_OPTIONS.includes(tSort)) {
      return tSort;
    }
  }
  return SORT_OPTIONS[0];
}

/**
 * Handler for the POST `/api/chirps` path.
 * Creates a new record for the specified chirp.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 */
export async function handlerCreateChirp(req: Request, res: Response): Promise<void> {
  const { body }: { body: string } = req.body;
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);

  if (!body) {
    throw new BadRequestError('Missing required field');
  }

  if (body.length > 140) {
    throw new BadRequestError('Chirp is too long. Max length is 140');
  }

  const cleanedBody = cleanWords(body);

  const chirp = await createChirp({ body: cleanedBody, userId });
  if (!chirp) {
    throw new Error('Failed to create new chirp');
  }

  res.status(201).json(chirp);
}

/**
 * Handler for the GET `/api/chirps` path.
 * Retrieves all chirps.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 */
export async function handlerGetAllChirps(req: Request, res: Response): Promise<void> {
  const { authorId, sort } = req.query;
  const sortOrder = getSortOrder(sort);

  if (typeof authorId === 'string' && authorId !== '') {
    const chirps = await getChirpsByUserId(authorId, sortOrder);
    res.status(200).json(chirps);
    return;
  }

  const chirps = await getAllChirps(sortOrder);
  res.status(200).json(chirps);
}

/**
 * Handler for the GET `/api/chirps/:chirpId` path.
 * Retrieves the chirp corresponding to the specified id.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 */
export async function handlerGetChirp(req: Request, res: Response): Promise<void> {
  let { chirpId } = req.params;

  if (Array.isArray(chirpId)) {
    chirpId = chirpId[0];
  }

  const chirp = await getChirpById(chirpId);
  if (!chirp) {
    throw new NotFoundError('Resource not found');
  }

  res.status(200).json(chirp);
}

/**
 * Handler for the DELETE `/api/chirps/:chirpId` path.
 * Deletes the record for the specified chirp by its id.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export async function handlerDeleteChirp(req: Request, res: Response): Promise<void> {
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);
  let { chirpId } = req.params;

  if (Array.isArray(chirpId)) {
    chirpId = chirpId[0];
  }

  const chirp = await getChirpById(chirpId);
  if (!chirp) {
    throw new NotFoundError('Resource not found');
  }

  if (chirp.userId !== userId) {
    throw new ForbiddenError('Not authorized');
  }

  await deleteChirp(chirpId);
  res.status(204).end();
}
