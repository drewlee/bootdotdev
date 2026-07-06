import { getFeedByUrl } from '../lib/db/queries/feeds.js';
import {
  createFeedFollow,
  getFeedFollowsForUser,
  deleteFeedFollow,
} from '../lib/db/queries/feed-follows.js';
import type { User } from '../lib/db/schema.js';

/**
 * Follows the feed at the given URL on behalf of the user.
 *
 * @param cmdName - Command name.
 * @param user - Currently logged in user.
 * @param args - Command arguments; the feed URL to follow.
 */
export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feed_url>`);
  }

  const feedUrl = args[0];
  const feed = await getFeedByUrl(feedUrl);

  if (!feed) {
    throw new Error(`Feed ${feedUrl} not found`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);
  console.log(`User ${feedFollow.userName} is now following "${feedFollow.feedName}"`);
}

/**
 * Lists the feeds the user is currently following.
 *
 * @param _ - Command name (unused).
 * @param user - Currently logged in user.
 */
export async function handlerFollowing(_: string, user: User) {
  const feedFollows = await getFeedFollowsForUser(user.id);

  if (!feedFollows.length) {
    console.log(`No feeds found for user ${user.name}`);
    return;
  }

  let out = `User ${user.name} is following:\n`;

  for (const follow of feedFollows) {
    out += `* ${follow.feedName}\n`;
  }

  console.log(out);
}

/**
 * Unfollows the feed at the given URL on behalf of the user.
 *
 * @param cmdName - Command name.
 * @param user - Currently logged in user.
 * @param args - Command arguments; the feed URL to unfollow.
 */
export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feed_url>`);
  }

  const feedUrl = args[0];
  const feed = await getFeedByUrl(feedUrl);

  if (!feed) {
    throw new Error(`Failed to get feed for ${feedUrl}`);
  }

  const result = await deleteFeedFollow(user.id, feed.id);
  if (!result) {
    throw new Error(`Failed to unfollow feed ${feedUrl}`);
  }

  console.log(`User ${user.name} unfollowed ${feedUrl}`);
}
