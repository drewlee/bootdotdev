import { type State } from './state.js';

export function cleanInput(input: string): string[] {
  return input
    .split(' ')
    .filter((value) => value !== '')
    .map((value) => value.toLowerCase());
}

export function startREPL(state: State): void {
  const { commands, rl } = state;

  rl.on('line', (input) => {
    const parts = cleanInput(input);

    if (!parts.length) {
      rl.prompt();
      return;
    }

    if (parts[0] in commands) {
      commands[parts[0]].callback(state);
    } else {
      console.log('Unknown command');
    }

    rl.prompt();
  });

  rl.prompt();
}
