import { eq } from 'drizzle-orm';
import { db } from '../index.js';
import { type NewUser, type User, users } from '../schema.js';

/**
 * Inserts a new record for the specified user.
 *
 * @param user - Parameters for the user to insert.
 * @returns New user record.
 */
export async function createUser(user: NewUser): Promise<User> {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();

  return result;
}

/**
 * Deletes all user records.
 */
export async function deleteUsers(): Promise<void> {
  await db.delete(users);
}

/**
 * Retrieves the user record for the specified email address.
 *
 * @param email - Email address.
 * @returns User record.
 */
export async function getUserByEmail(email: string): Promise<User> {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

/**
 * Updates the user record for the specified id and returns it.
 *
 * @param userId - User id.
 * @param email - User email address.
 * @param hashedPassword - Hashed password.
 * @returns Updated user record.
 */
export async function updateUser(
  userId: string,
  email: string,
  hashedPassword: string,
): Promise<User> {
  const [result] = await db
    .update(users)
    .set({
      id: userId,
      email,
      hashedPassword,
    })
    .where(eq(users.id, userId))
    .returning();

  return result;
}

/**
 * Updates the user for the specified id to a Chirpy red user.
 *
 * @param userId - User id.
 * @returns Whether the record was successfully updated.
 */
export async function updateUserToChirpyRed(userId: string): Promise<boolean> {
  const result = await db
    .update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, userId))
    .returning();

  return result.length > 0;
}
