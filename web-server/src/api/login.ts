import type { Request, Response } from 'express';
import type { User } from '../db/schema.js';
import { saveRefreshToken } from '../db/queries/refresh-tokens.js';
import { UnauthorizedError } from '../utils/custom-errors.js';
import { getUserByEmail } from '../db/queries/users.js';
import { checkPasswordHash, makeJWT, makeRefreshToken } from '../utils/auth.js';
import config from '../config.js';

type UserRequest = {
  email: string;
  password: string;
};
type UserResponse = Omit<User, 'hashedPassword'>;
type LoginResponse = UserResponse & {
  token: string;
  refreshToken: string;
};

/**
 * Handler for the POST `/api/login` path.
 * Validates auth for the specified user info.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 */
export async function handlerLogin(req: Request, res: Response): Promise<void> {
  const { email, password }: UserRequest = req.body;
  const authError = new UnauthorizedError('Invalid email or password');

  if (!email || !password) {
    throw authError;
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw authError;
  }

  const isValidPassword = await checkPasswordHash(password, user.hashedPassword);
  if (!isValidPassword) {
    throw authError;
  }

  const token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
  const refreshToken = makeRefreshToken();
  const loginResponse = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed,
    token,
    refreshToken,
  } satisfies LoginResponse;

  const result = await saveRefreshToken(refreshToken, user.id);
  if (!result) {
    throw authError;
  }

  res.status(200).json(loginResponse);
}
