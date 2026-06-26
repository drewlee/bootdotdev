import { getFeedByUrl } from '../lib/db/queries/feeds.js';
import {
  createFeedFollow,
  getFeedFollowsForUser,
  deleteFeedFollow,
} from '../lib/db/queries/feed-follows.js';
import type { User } from '../lib/db/schema.js';

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
