import { type User } from '../lib/db/schema.js';

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

/**
 * Adds the specified command name and handler to the commands registry.
 *
 * @param registry - Command registry object.
 * @param cmdName - Name used to run the command.
 * @param handler - Callback function handler for the command.
 */
export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry[cmdName] = handler;
}

/**
 * Executes the specified command.
 *
 * @param registry - Command registry object.
 * @param cmdName - Name used to run the command.
 * @param args - Arguments for the command.
 */
export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (!(cmdName in registry)) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  await registry[cmdName](cmdName, ...args);
}
