import { type State } from './state.js';

/**
 * Command for exploring a location area.
 *
 * @param state - Application state.
 * @param locationName - Location area to explore.
 * @returns Promise.
 */
export async function commandExplore(
  state: State,
  locationName: string,
): Promise<void> {
  if (!locationName) {
    console.log('Please provide a location area name');
    return;
  }

  const { pokeAPI } = state;
  const results = await pokeAPI.fetchLocation(locationName);

  if (!results) {
    console.log('Unable to display location area. Please try again later.');
    return;
  }

  const { pokemon_encounters } = results;
  const output: string[] = [];

  for (const encounter of pokemon_encounters) {
    output.push(encounter.pokemon.name);
  }

  console.log(output.join('\n'));
}
