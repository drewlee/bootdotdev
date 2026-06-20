import { XMLParser } from 'fast-xml-parser';

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  const response = await fetch(feedURL, {
    headers: {
      'User-Agent': 'gator',
      accept: 'application/rss+xml',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed fetch on ${feedURL}:\n${response.status} ${response.statusText}`,
    );
  }

  const xml = await response.text();
  const parser = new XMLParser({ processEntities: false });
  const result = parser.parse(xml);
  const channel = result?.rss?.channel;

  if (!channel) {
    throw new Error('Missing required channel entry');
  }

  const reqInChannel = ['title', 'link', 'description'];
  const isValidChannel = reqInChannel.every((field) => {
    return field in channel && typeof channel[field] === 'string';
  });

  if (!isValidChannel || !channel.item) {
    throw new Error('Missing required entries in channel');
  }

  const items = Array.isArray(channel.item) ? channel.item : [channel.item];
  const rssItems: RSSItem[] = [];
  const reqInItem = ['title', 'link', 'description', 'pubDate'];

  for (const item of items) {
    const isValidItem = reqInItem.every((field) => {
      return field in item && typeof item[field] === 'string';
    });

    if (!isValidItem) {
      continue;
    }

    rssItems.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  const feed: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: rssItems,
    },
  };

  return feed;
}
