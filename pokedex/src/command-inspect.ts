import { type State } from './state.js';

export async function commandInspect(state: State, pokemonName: string): Promise<void> {
  if (!pokemonName) {
    console.log('Please provide a Pokemon name');
    return;
  }

  if (pokemonName in state.pokedex) {
    const data = state.pokedex[pokemonName];
    const output: string[] = [
      `Name: ${data.name}`,
      `Height: ${data.height}`,
      `Weight: ${data.weight}`,
      'Stats:',
    ];

    for (const stat of data.stats) {
      output.push(`-${stat.stat.name}: ${stat.base_stat}`);
    }

    output.push('Types:');

    for (const type of data.types) {
      output.push(`- ${type.type.name}`);
    }

    console.log(output.join('\n'));
  } else {
    console.log('You have not caught that pokemon');
  }
}
