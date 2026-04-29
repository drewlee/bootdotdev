import { type State } from './state.js';

/**
 * Cleans and formats user input.
 *
 * @param input - User input.
 * @returns User input formatted as an array.
 */
export function cleanInput(input: string): string[] {
  return input
    .split(' ')
    .filter((value) => value !== '')
    .map((value) => value.toLowerCase());
}

/**
 * Handles prompting and processing user input.
 *
 * @param state - Application state object.
 */
export function startREPL(state: State): void {
  const { commands, rl } = state;

  rl.on('line', async (input) => {
    const args = cleanInput(input);

    if (!args.length) {
      rl.prompt();
      return;
    }

    const command = args[0];

    if (command in commands) {
      const options = args.slice(1);
      await commands[command].callback(state, ...options);
    } else {
      console.log('Unknown command');
    }

    rl.prompt();
  });

  rl.prompt();
}
