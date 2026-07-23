import { db } from '../index.js';
import { type NewChirp, type Chirp, chirps } from '../schema.js';

/**
 * Inserts a new record for the specified chirp.
 *
 * @param chirp - Parameters for the chirp to insert.
 * @returns New chirp record.
 */
export async function createChirp(chirp: NewChirp): Promise<Chirp> {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();

  return result;
}
