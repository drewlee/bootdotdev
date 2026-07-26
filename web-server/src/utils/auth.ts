import argon2 from 'argon2';

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
