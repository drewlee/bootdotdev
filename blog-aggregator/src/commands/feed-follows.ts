import { readConfig } from '../config.js';
import { getUser } from '../lib/db/queries/users.js';
import { getFeedByUrl } from '../lib/db/queries/feeds.js';
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from '../lib/db/queries/feed-follows.js';

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feed_url>`);
  }

  const { currentUserName } = readConfig();
  const user = await getUser(currentUserName);

  if (!user) {
    throw new Error(`User ${currentUserName} not found`);
  }

  const feedUrl = args[0];
  const feed = await getFeedByUrl(feedUrl);

  if (!feed) {
    throw new Error(`Feed ${feedUrl} not found`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);
  console.log(`User ${feedFollow.userName} is now following "${feedFollow.feedName}"`);
}

export async function handlerFollowing() {
  const { currentUserName } = readConfig();
  const user = await getUser(currentUserName);

  if (!user) {
    throw new Error(`User ${currentUserName} not found`);
  }

  const feedFollows = await getFeedFollowsForUser(user.id);

  if (!feedFollows) {
    console.log(`No feeds found for user ${user.name}`);
    return;
  }

  let out = `User ${user.name} is following:\n`;

  for (const follow of feedFollows) {
    out += `* ${follow.feedName}\n`;
  }

  console.log(out);
}
