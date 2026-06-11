import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from './commands/commands.js';
import { handlerLogin } from './commands/login.js';

function main() {
  const args = process.argv.slice(2);

  if (!args.length) {
    console.log('usage: cli <command> [args...]');
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, 'login', handlerLogin);

  try {
    runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error running command ${cmdName}: ${error.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${error}`);
    }

    process.exit(1);
  }
}

main();
