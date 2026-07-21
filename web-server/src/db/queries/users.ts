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
