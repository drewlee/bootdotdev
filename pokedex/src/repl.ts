import { createInterface } from 'node:readline';

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

  rl.on('line', (input) => {
    const parts = cleanInput(input);

    if (!parts.length) {
      rl.prompt();
    } else {
      console.log(`Your command was: ${parts[0]}`);
      rl.prompt();
    }
  });

  rl.prompt();
}
