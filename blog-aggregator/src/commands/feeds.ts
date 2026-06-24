import { readConfig } from '../config.js';
import { createFeed, getFeeds } from '../lib/db/queries/feeds.js';
import { getUser } from '../lib/db/queries/users.js';
import { createFeedFollow } from '../lib/db/queries/feed-follows.js';
import type { Feed, User } from '../lib/db/schema.js';

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

export async function handlerAddFeed(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <feed_url>`);
  }

  const config = readConfig();
  const user = await getUser(config.currentUserName);

  if (!user) {
    throw new Error(`User ${config.currentUserName} not found`);
  }

  const [name, url] = args;
  const feed = await createFeed(name, url, user.id);

  if (!feed) {
    console.log(`Failed to create feed: ${name}`);
    return;
  }

  await createFeedFollow(user.id, feed.id);

  console.log('Feed created successfully:');
  printFeed(feed, user);
}

export async function handlerFeeds(cmdName: string, ...args: string[]): Promise<void> {
  const records = await getFeeds();

  if (!records) {
    console.log('No feeds found');
    return;
  }

  console.log(`Found ${records.length} feeds:\n`);

  for (const { feeds, users } of records) {
    printFeed(feeds, users);
    console.log('\n');
  }
}
