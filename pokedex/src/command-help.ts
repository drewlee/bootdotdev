import type { CLICommand, State } from './state.js';

export function commandHelp(state: State): void {
  console.log('Welcome to the Pokedex!\nUsage:\n');

  for (const value of Object.values(state.commands)) {
    console.log(`${value.name}: ${value.description}`);
  }
}
