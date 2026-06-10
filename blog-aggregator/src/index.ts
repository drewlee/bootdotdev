import { readConfig, setUser } from './config.js';

function main() {
  setUser('Andrew');
  const config = readConfig();
  console.log(config);
}

main();
