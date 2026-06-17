import { getUsers } from '../lib/db/queries/users.js';
import { readConfig } from '../config.js';

export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
  const records = await getUsers();
  const config = readConfig();
  let out = '';

  for (const record of records) {
    const { name } = record;
    out += `* ${name}${name === config.currentUserName ? ' (current)' : ''}\n`;
  }

  console.log(out);
}
