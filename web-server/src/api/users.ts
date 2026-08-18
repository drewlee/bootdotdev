import { type NextFunction, type Request, type Response } from 'express';
import config from '../config.js';
import type { User } from '../db/schema.js';
import { BadRequestError } from '../utils/custom-errors.js';
import { hashPassword } from '../utils/auth.js';
import { createUser, updateUser } from '../db/queries/users.js';
import { getBearerToken, validateJWT } from '../utils/auth.js';

type UserRequest = {
  email: string;
  password: string;
};
type UserResponse = Omit<User, 'hashedPassword'>;

/**
 * Handler for the POST `/api/users` path.
 * Creates a new record for the specified user.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 */
export async function handlerCreateUser(req: Request, res: Response): Promise<void> {
  const { email, password }: UserRequest = req.body;

  if (!email || !password) {
    throw new BadRequestError('Missing required fields');
  }

  const hashedPassword = await hashPassword(password);
  const user = await createUser({ email, hashedPassword });

  if (!user) {
    throw new Error('Failed to create new user');
  }

  res.status(201).json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed,
  } satisfies UserResponse);
}

/**
 * Handler for the POST `/api/users` path.
 * Updates the email and password for the current user.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 */
export async function handlerUpdateUser(req: Request, res: Response) {
  const { email, password }: UserRequest = req.body;
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);

  if (!email || !password) {
    throw new BadRequestError('Missing required fields');
  }

  const hashedPassword = await hashPassword(password);
  const user = await updateUser(userId, email, hashedPassword);
  if (!user) {
    throw new Error('Failed to update user');
  }

  res.status(200).json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed,
  } satisfies UserResponse);
}
