import { type User } from '../lib/db/schema.js';
import { getNextFeedToFetch } from '../lib/db/queries/feed-follows.js';
import { fetchFeed } from '../lib/rss/fetch.js';
import { markFeedFetched } from '../lib/db/queries/feeds.js';

function parseDuration(durationStr: string): number | undefined {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match || match.length < 3) {
    return;
  }

  const duration = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'ms':
      return duration;
    case 's':
      return duration * 1000;
    case 'm':
      return duration * 1000 * 60;
    case 'h':
      return duration * 1000 * 60 * 60;
    default:
      return;
  }
}

function handleError(err: unknown): void {
  console.error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`);
}

async function scrapeFeeds(userId: string): Promise<void> {
  const feed = await getNextFeedToFetch(userId);
  if (!feed) {
    console.log('No feeds to fetch');
    return;
  }

  const feedData = await fetchFeed(feed.url);
  await markFeedFetched(feed.id);

  for (const item of feedData.channel.item) {
    console.log(item.title);
  }

  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`,
  );
}

export async function handlerAgg(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const duration = args[0];
  const parsedDuration = parseDuration(args[0]);

  if (!parseDuration) {
    throw new Error(
      `Invalid duration: ${duration}. Use format 1h, 30m, 15s, or 3500ms.`,
    );
  }

  console.log(`Collecting feeds every ${duration}...`);

  scrapeFeeds(user.id).catch(handleError);

  const intervalId = setInterval(() => {
    scrapeFeeds(user.id).catch(handleError);
  }, parsedDuration);

  await new Promise<void>((resolve) => {
    process.on('SIGINT', () => {
      console.log('Shutting down feed aggregator...');
      clearInterval(intervalId);
      resolve();
    });
  });
}
