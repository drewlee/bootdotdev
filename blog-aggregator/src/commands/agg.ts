import { fetchFeed } from '../lib/rss/fetch.js';

export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
  const feedURL = 'https://www.wagslane.dev/index.xml';
  const result = await fetchFeed(feedURL);

  console.log(JSON.stringify(result, null, 2));
}
