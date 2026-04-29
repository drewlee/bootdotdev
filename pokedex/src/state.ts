import { createInterface, type Interface } from 'node:readline';
import { getCommands } from './commands.js';
import { type Pokemon, PokeAPI } from './poke-api.js';

export type State = {
  commands: Record<string, CLICommand>;
  nextLocationsURL: string | null;
  pokeAPI: PokeAPI;
  pokedex: Record<string, Pokemon>;
  prevLocationsURL: string | null;
  rl: Interface;
};

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

/**
 * Initializes and returns the application state object.
 *
 * @returns Application state object.
 */
export function initState(): State {
  const commands = getCommands();
  const pokeAPI = new PokeAPI();
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Pokedex > ',
  });

  return {
    commands,
    nextLocationsURL: 'https://pokeapi.co/api/v2/location-area?offset=0&limit=20',
    pokeAPI,
    pokedex: {},
    prevLocationsURL: null,
    rl,
  };
}
