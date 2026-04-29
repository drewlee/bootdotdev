import process from 'node:process';
import { type State } from './state.js';

/**
 * Command for exiting the application.
 *
 * @param state - Application state object.
 */
export async function commandExit(state: State): Promise<void> {
  console.log('Closing the Pokedex... Goodbye!');
  state.rl.close();
  process.exit(0);
}
