import { and, eq } from 'drizzle-orm';
import { db } from '../index.js';
import { feedFollows, feeds, users } from '../schema.js';

/**
 * Creates a feed follow linking the specified user and feed.
 *
 * @param userId - ID of the user following the feed.
 * @param feedId - ID of the feed being followed.
 * @returns The created feed follow, joined with the feed and user names.
 */
export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({
      userId,
      feedId,
    })
    .returning();

  const [feedFollow] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAT: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  return feedFollow;
}

/**
 * Retrieves all feed follows for the specified user.
 *
 * @param userId - ID of the user.
 * @returns The feed follow records, joined with the feed names.
 */
export async function getFeedFollowsForUser(userId: string) {
  const records = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));

  return records;
}

/**
 * Deletes the feed follow linking the specified user and feed.
 *
 * @param userId - ID of the user following the feed.
 * @param feedId - ID of the feed being followed.
 * @returns The deleted feed follow record, or undefined if none existed.
 */
export async function deleteFeedFollow(userId: string, feedId: string) {
  const [result] = await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)))
    .returning();

  return result;
}
