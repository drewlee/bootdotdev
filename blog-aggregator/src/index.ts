import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from './commands/commands.js';
import { handlerLogin } from './commands/login.js';
import { handlerRegister } from './commands/register.js';

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
