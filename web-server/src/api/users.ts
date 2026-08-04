import { type NextFunction, type Request, type Response } from 'express';
import { config } from '../config.js';
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
 * @param next - Next middleware function to yield to.
 */
export function handlerCreateUser(req: Request, res: Response, next: NextFunction): void {
  const { email, password }: UserRequest = req.body;

  if (!email || !password) {
    next(new BadRequestError('Missing required fields'));
    return;
  }

  hashPassword(password)
    .then((hashedPassword) => createUser({ email, hashedPassword }))
    .then((user) => {
      if (!user) {
        throw new Error('Failed to create new user');
      }

      res.status(201).json({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } satisfies UserResponse);

      next();
    })
    .catch(next);
}

/**
 * Handler for the POST `/api/users` path.
 * Updates the email and password for the current user.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
export function handlerUpdateUser(req: Request, res: Response, next: NextFunction) {
  const { email, password }: UserRequest = req.body;
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);

  if (!email || !password) {
    next(new BadRequestError('Missing required fields'));
    return;
  }

  hashPassword(password)
    .then((hashedPassword) => updateUser(userId, email, hashedPassword))
    .then((user) => {
      if (!user) {
        throw new Error('Failed to update user');
      }

      res.status(200).json({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } satisfies UserResponse);

      next();
    })
    .catch(next);
}
