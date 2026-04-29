import { type State } from './state.js';

export async function commandPokedex(state: State): Promise<void> {
  const { pokedex } = state;

  if (!Object.keys(pokedex).length) {
    console.log('You have not caught any Pokemon!');
    return;
  }

  const output = ['Your Pokedex:'];

  for (const name of Object.keys(pokedex)) {
    output.push(`- ${name}`);
  }

  console.log(output.join('\n'));
}
