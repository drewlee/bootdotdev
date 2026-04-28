import { commandExit } from './command-exit.js';
import { commandHelp } from './command-help.js';
import { commandMap, commandMapB } from './command-map.js';
import { commandExplore } from './command-explore.js';
import { commandCatch } from './command-catch.js';
import { type CLICommand } from './state.js';

export function getCommands(): Record<string, CLICommand> {
  return {
    exit: {
      name: 'exit',
      description: 'Exits the pokedex',
      callback: commandExit,
    },
    help: {
      name: 'help',
      description: 'Displays a help message',
      callback: commandHelp,
    },
    map: {
      name: 'map',
      description: 'Displays the next set of location area names',
      callback: commandMap,
    },
    mapb: {
      name: 'mapb',
      description: 'Displays the previous set of location area names',
      callback: commandMapB,
    },
    explore: {
      name: 'explore',
      description: 'Explores the specified location area name for Pokemon',
      callback: commandExplore,
    },
    catch: {
      name: 'catch',
      description: 'Attempts to catch the specified Pokemon',
      callback: commandCatch,
    },
  };
}
