import { setUser } from '../config.js';
import { getUser } from '../lib/db/queries/users.js';

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <user_name>`);
  }

  const userName = args[0];
  const record = await getUser(userName);

  if (!record) {
    throw new Error(`User ${userName} is not registered`);
  }

  setUser(record.name);
  console.log(`Successfully set user as ${record.name}`);
}
