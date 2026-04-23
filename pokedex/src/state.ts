import { createInterface, type Interface } from 'node:readline';
import { getCommands } from './commands.js';

export type State = {
  commands: Record<string, CLICommand>;
  rl: Interface;
};

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => void;
};

export function initState(): State {
  const commands = getCommands();
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Pokedex > ',
  });

  return {
    commands,
    rl,
  };
}
