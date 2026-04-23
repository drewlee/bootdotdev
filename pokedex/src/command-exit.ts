import process from 'node:process';

export function commandExit(): void {
  console.log('Closing the Pokedex... Goodbye!');
  process.exit(0);
}
