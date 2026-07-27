import { describe, test, expect, beforeAll } from 'vitest';
import { UnauthorizedError } from './custom-errors.js';
import { hashPassword, checkPasswordHash, makeJWT, validateJWT } from './auth.js';

describe('Password hashing', () => {
  const password1 = 'correctPassword123!';
  const password2 = 'anotherPassword456!';
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    [hash1, hash2] = await Promise.all([
      hashPassword(password1),
      hashPassword(password2),
    ]);
  });

  test('Returns `true` for the correct password', async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  test('Returns `false` for an incorrect password', async () => {
    const result = await checkPasswordHash('invalid', hash1);
    expect(result).toBe(false);
  });

  test('Returns `false` for an empty password', async () => {
    const result = await checkPasswordHash('', hash1);
    expect(result).toBe(false);
  });

  test('Returns `false` for a non-matching hash', async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });

  test('Throws error for invalid hash', async () => {
    await expect(checkPasswordHash(password1, '')).rejects.toThrow();
  });
});

describe('JSON web token validation', () => {
  const secret = 'goodtimes';
  const userID = '1234';
  let token: string;

  beforeAll(() => {
    token = makeJWT(userID, 5 * 60, secret);
  });

  test('Returns the decoded user ID', () => {
    const result = validateJWT(token, secret);
    expect(result).toBe(userID);
  });

  test('Throws error for invalid secret', () => {
    expect(() => validateJWT(token, 'invalid')).toThrow(UnauthorizedError);
  });

  test('Throws error for invalid token', () => {
    expect(() => validateJWT('foobarbaz', secret)).toThrow(UnauthorizedError);
  });

  test('Throws error for expired token', () => {
    const token = makeJWT(userID, -5 * 60, secret);
    expect(() => validateJWT(token, secret)).toThrow(UnauthorizedError);
  });
});
