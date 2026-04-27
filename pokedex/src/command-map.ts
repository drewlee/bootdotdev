import { type State } from './state.js';

export async function commandMap(state: State): Promise<void> {
  const { nextLocationsURL, pokeAPI } = state;

  if (nextLocationsURL === null) {
    console.log(
      'No more location area names to display. Use the `mapb` command to view the previous set of location area names.',
    );
    return;
  }

  const data = await pokeAPI.fetchLocations(nextLocationsURL);
  if (!data) {
    console.log('Unable to display locations. Please try again later.');
    return;
  }

  const { next, previous, results } = data;
  state.nextLocationsURL = next;
  state.prevLocationsURL = previous;

  const locations: string[] = [];
  for (const location of results) {
    locations.push(location.name);
  }

  console.log(locations.join('\n'));
}

export async function commandMapB(state: State): Promise<void> {
  const { pokeAPI, prevLocationsURL } = state;

  if (prevLocationsURL === null) {
    console.log(
      'No previous location area names to display. Use the `map` command to view the next set of location area names.',
    );
    return;
  }

  const data = await pokeAPI.fetchLocations(prevLocationsURL);
  if (!data) {
    console.log('Unable to display locations. Please try again later.');
    return;
  }

  const { next, previous, results } = data;
  state.nextLocationsURL = next;
  state.prevLocationsURL = previous;

  const locations: string[] = [];
  for (const location of results) {
    locations.push(location.name);
  }

  console.log(locations.join('\n'));
}
