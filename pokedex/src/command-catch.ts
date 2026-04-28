import { type State } from './state.js';

export async function commandCatch(state: State, pokemonName: string): Promise<void> {
  if (!pokemonName) {
    console.log('Please provide a Pokemon name');
    return;
  }

  console.log(`Throwing a Pokeball at ${pokemonName}...`);

  const { pokeAPI } = state;
  const results = await pokeAPI.fetchPokemon(pokemonName);

  if (!results) {
    console.log('Unable to get Pokemon data. Please try again later.');
    return;
  }

  const { base_experience } = results;
  const catchRate = Math.round((base_experience / 200) * 10);
  const randInt = Math.floor(Math.random() * 10) + 1;

  if (randInt >= catchRate) {
    console.log(`${pokemonName} was caught!`);
    state.pokedex[pokemonName] = results;
  } else {
    console.log(`${pokemonName} escaped!`);
  }
}
