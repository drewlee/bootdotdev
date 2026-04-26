import { commandExit } from './command-exit.js';
import { commandHelp } from './command-help.js';
import { commandMap, commandMapB } from './command-map.js';
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
      description: 'Displays the next page of location areas',
      callback: commandMap,
    },
    mapb: {
      name: 'mapb',
      description: 'Displays the previous page of location areas',
      callback: commandMapB,
    },
  };
}
