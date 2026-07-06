import { type User } from '../lib/db/schema.js';
import { getPostsForUser } from '../lib/db/queries/posts.js';

/**
 * Prints the most recent posts from the feeds the user follows.
 *
 * @param cmdName - Command name.
 * @param user - Currently logged in user.
 * @param args - Command arguments; an optional post limit (defaults to 2).
 */
export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
  let limit = 2;

  if (args.length === 1) {
    const parsedLimit = Number(args[0].trim());

    if (!Number.isNaN(parsedLimit)) {
      limit = parsedLimit;
    } else {
      throw new Error(`Invalid limit value - usage: ${cmdName} [<limit_number>]`);
    }
  }

  const posts = await getPostsForUser(user.id, limit);

  if (!posts.length) {
    console.log('No recent posts found');
    return;
  }

  console.log(`Found ${posts.length} posts for user ${user.name}\n`);

  for (let post of posts) {
    console.log(`${post.publishedAt} from ${post.feedName}`);
    console.log(`  ${post.title}`);
    console.log(`  ${post.description}`);
    console.log(`  ${post.url}`);
    console.log(`\n${'='.repeat(50)}\n`);
  }
}
