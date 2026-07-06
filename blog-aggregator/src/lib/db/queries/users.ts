import { eq } from 'drizzle-orm';
import { db } from '../index.js';
import { users } from '../schema.js';

/**
 * Creates a new database record for the specified user name.
 *
 * @param name - User name.
 * @returns The newly created database record.
 */
export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name }).returning();
  return result;
}

/**
 * Retrieves the database record for the specified user name.
 *
 * @param name - User name.
 * @returns The database record.
 */
export async function getUser(name: string) {
  const [result] = await db.select().from(users).where(eq(users.name, name));
  return result;
}

/**
 * Retrieves the records for all registered users in the database.
 *
 * @returns The database records.
 */
export async function getUsers() {
  return await db.select().from(users);
}

/**
 * Deletes all records of registered users from the database.
 */
export async function deleteUsers(): Promise<void> {
  await db.delete(users);
}
