import { initState } from './state.js';
import { startREPL } from './repl.js';

/**
 * Application entry point.
 */
function main(): void {
  const state = initState();
  startREPL(state);
}

main();
