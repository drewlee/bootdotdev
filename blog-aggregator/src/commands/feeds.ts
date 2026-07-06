import { createFeed, getFeeds } from '../lib/db/queries/feeds.js';
import { createFeedFollow } from '../lib/db/queries/feed-follows.js';
import type { Feed, User } from '../lib/db/schema.js';

/**
 * Prints the details of a feed and its owning user to the console.
 *
 * @param feed - Feed to print.
 * @param user - User that owns the feed.
 */
function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

/**
 * Creates a new feed owned by the user and follows it automatically.
 *
 * @param cmdName - Command name.
 * @param user - Currently logged in user.
 * @param args - Command arguments; the feed name and URL.
 */
export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <feed_url>`);
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

/**
 * Lists all feeds in the database along with their owning users.
 */
export async function handlerFeeds(): Promise<void> {
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
