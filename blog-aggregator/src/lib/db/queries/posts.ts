import { desc, eq } from 'drizzle-orm';
import { feedFollows, feeds, posts, users } from '../schema.js';
import { db } from '../index.js';
import { type RSSItem } from '../../rss/fetch.js';

export async function createPost(post: RSSItem, feedId: string) {
  const [result] = await db
    .insert(posts)
    .values({
      title: post.title,
      url: post.link,
      description: post.description,
      publishedAt: new Date(post.pubDate),
      feedId,
    })
    .returning();

  return result;
}

export async function getPostsForUser(userId: string, limit: number) {
  const results = await db
    .select({
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.createdAt))
    .limit(limit);

  return results;
}
