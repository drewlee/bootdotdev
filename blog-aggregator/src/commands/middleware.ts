import type { CommandHandler, UserCommandHandler } from './commands.js';
import { readConfig } from '../config.js';
import { getUser } from '../lib/db/queries/users.js';

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const { currentUserName } = readConfig();
    if (!currentUserName) {
      throw new Error('User not logged in');
    }

    const user = await getUser(currentUserName);
    if (!user) {
      throw new Error(`User ${currentUserName} not found`);
    }

    await handler(cmdName, user, ...args);
  };
}
