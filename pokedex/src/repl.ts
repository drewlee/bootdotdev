import { createInterface } from 'node:readline';
import { getCommands } from './commands.js';

export function cleanInput(input: string): string[] {
  return input.split(' ')
    .filter((value) => value !== '')
    .map((value) => value.toLowerCase());
}

export function startREPL(): void {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Pokedex > ',
  });

  const commands = getCommands();

  rl.on('line', (input) => {
    const parts = cleanInput(input);

    if (!parts.length) {
      rl.prompt();
      return;
    }

    if (parts[0] in commands) {
      commands[parts[0]].callback(commands);
    } else {
      console.log('Unknown command');
    }

    rl.prompt();
  });

  rl.prompt();
}
