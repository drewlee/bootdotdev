import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from './commands/commands.js';
import {
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
} from './commands/users.js';
import { handlerAgg } from './commands/agg.js';
import { handlerAddFeed, handlerFeeds } from './commands/feeds.js';
import { handlerFollow, handlerFollowing } from './commands/feed-follows.js';

/**
 * Main application entry point.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (!args.length) {
    console.log('usage: cli <command> [args...]');
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, 'login', handlerLogin);
  registerCommand(commandsRegistry, 'register', handlerRegister);
  registerCommand(commandsRegistry, 'reset', handlerReset);
  registerCommand(commandsRegistry, 'users', handlerUsers);
  registerCommand(commandsRegistry, 'agg', handlerAgg);
  registerCommand(commandsRegistry, 'addfeed', handlerAddFeed);
  registerCommand(commandsRegistry, 'feeds', handlerFeeds);
  registerCommand(commandsRegistry, 'follow', handlerFollow);
  registerCommand(commandsRegistry, 'following', handlerFollowing);

  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error running command ${cmdName}: ${error.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${error}`);
    }

    process.exit(1);
  }

  process.exit(0);
}

main();
