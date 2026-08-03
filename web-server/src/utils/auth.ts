import argon2 from 'argon2';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import crypto from 'node:crypto';
import type { Request } from 'express';
import { UnauthorizedError, BadRequestError } from './custom-errors.js';

type Payload = Pick<JwtPayload, 'iss' | 'sub' | 'iat' | 'exp'>;

const TOKEN_ISSUER = 'chirpy';

/**
 * Creates and returns a hash for the given password.
 *
 * @param password - Password to hash.
 * @returns Hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const hash = await argon2.hash(password);
  return hash;
}

/**
 * Checks whether the provided hash matches the specified password.
 *
 * @param password - Password to validate.
 * @param hash - Hashed password.
 * @returns Whether the password matches the hash.
 */
export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  const isMatch = await argon2.verify(hash, password);
  return isMatch;
}

/**
 * Creates and returns a new JSON web token.
 *
 * @param userID - User ID.
 * @param expiresIn - Expiration timestamp in seconds.
 * @param secret - Secret value for token creation.
 * @returns New JSON web token.
 */
export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresIn;
  const payload: Payload = {
    iss: TOKEN_ISSUER, // issuer
    sub: userID,       // subject
    iat,               // time of issue in seconds
    exp,               // time of expiration in seconds
  };
  const token = jwt.sign(payload, secret);

  return token;
}

/**
 * Verifies the given JWT token and returns its decoded user ID.
 *
 * @param tokenString - Token to verify.
 * @param secret - Secret value for token verification.
 * @returns User ID.
 */
export function validateJWT(tokenString: string, secret: string): string {
  let payload: Payload;

  try {
    payload = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }

  if (payload.iss !== TOKEN_ISSUER) {
    throw new UnauthorizedError('Invalid issuer');
  }

  if (!payload.sub) {
    throw new UnauthorizedError('Invalid user ID');
  }

  return payload.sub;
}

/**
 * Extracts the bearer authorization token from the given header string.
 *
 * @param header - Header string.
 * @returns Bearer authorization token.
 */
export function extractBearerToken(header: string): string {
  const prefix = 'Bearer ';

  if (header.startsWith(prefix)) {
    const token = header.slice(prefix.length);
    if (token.length > 0) {
      return token;
    }
  }

  throw new BadRequestError('Malformed authorization header');
}

/**
 * Retrieves the bearer authorization token from the HTTP request object.
 *
 * @param req - HTTP request object.
 * @returns Bearer authorization token.
 */
export function getBearerToken(req: Request): string {
  const auth = req.get('Authorization');

  if (!auth) {
    throw new BadRequestError('Malformed authorization header');  
  }

  return extractBearerToken(auth);
}

/**
 * TODO
 *
 * @returns 
 */
export function makeRefreshToken(): string {
  const rawToken = crypto.randomBytes(32);
  return rawToken.toString('hex');
}
