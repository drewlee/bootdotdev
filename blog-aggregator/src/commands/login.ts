import { setUser } from '../config.js';

export function handlerLogin(cmdName: string, ...args: string[]): void {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <user_name>`);
  }

  const userName = args[0];
  setUser(userName);

  console.log(`Successfully set user as ${userName}`);
}
