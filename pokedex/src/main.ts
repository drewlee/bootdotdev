import { initState } from './state.js';
import { startREPL } from './repl.js';

const CACHE_INTERVAL_MS = 30000;

/**
 * Application entry point.
 */
function main(): void {
  const state = initState(CACHE_INTERVAL_MS);
  startREPL(state);
}

main();
