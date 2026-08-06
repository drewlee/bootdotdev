import { asc, and, eq } from 'drizzle-orm';
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

/**
 * Retrieves all chirp records.
 *
 * @returns Chirp records.
 */
export async function getAllChirps(): Promise<Chirp[]> {
  const results = await db
    .select()
    .from(chirps)
    .orderBy(asc(chirps.createdAt));

  return results;
}

/**
 * Retrieves chirp record for the specified id.
 *
 * @param chirpId - Chirp id.
 * @returns Chirp record.
 */
export async function getChirpById(chirpId: string): Promise<Chirp> {
  const [result] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, chirpId));

  return result;
}

/**
 * Deletes chirp record for the specified id.
 *
 * @param chirpId - Chirp id.
 * @param userId - User id.
 */
export async function deleteChirp(chirpId: string): Promise<void> {
  await db
    .delete(chirps)
    .where(eq(chirps.id, chirpId));
}
