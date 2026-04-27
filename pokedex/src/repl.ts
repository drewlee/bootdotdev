import { type State } from './state.js';

export function cleanInput(input: string): string[] {
  return input
    .split(' ')
    .filter((value) => value !== '')
    .map((value) => value.toLowerCase());
}

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
