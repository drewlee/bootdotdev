import { eq, sql } from 'drizzle-orm';
import { db } from '../index.js';
import { feeds, users } from '../schema.js';

/**
 * Creates a new feed record owned by the specified user.
 *
 * @param name - Feed name.
 * @param url - Feed URL.
 * @param userId - ID of the user that owns the feed.
 * @returns The newly created feed record.
 */
export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db.insert(feeds).values({ name, url, userId }).returning();
  return result;
}

/**
 * Retrieves all feeds joined with their owning users.
 *
 * @returns The feed records, each joined with its owning user.
 */
export async function getFeeds() {
  return await db.select().from(feeds).innerJoin(users, eq(feeds.userId, users.id));
}

/**
 * Retrieves the feed record with the specified URL.
 *
 * @param url - Feed URL.
 * @returns The feed record, or undefined if not found.
 */
export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

/**
 * Updates the last fetched timestamp of the specified feed to now.
 *
 * @param feedId - ID of the feed to mark as fetched.
 * @returns The updated feed record.
 */
export async function markFeedFetched(feedId: string) {
  const [result] = await db
    .update(feeds)
    .set({
      lastFetchedAt: new Date(),
    })
    .where(eq(feeds.id, feedId))
    .returning();

  return result;
}

/**
 * Retrieves the feed that is next due to be fetched, prioritizing feeds that
 * have never been fetched, then the least recently fetched.
 *
 * @returns The next feed to fetch, or undefined if there are no feeds.
 */
export async function getNextFeedToFetch() {
  const results = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
    .limit(1);

  return results[0];
}
