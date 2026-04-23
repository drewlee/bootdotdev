import { type CLICommand } from './commands.js';

export function commandHelp(commands: Record<string, CLICommand>): void {
  console.log('Welcome to the Pokedex!\nUsage:\n');

  for (const value of Object.values(commands)) {
    console.log(`${value.name}: ${value.description}`);
  }
}
