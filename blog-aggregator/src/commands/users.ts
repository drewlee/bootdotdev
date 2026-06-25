import { setUser } from '../config.js';
import { createUser, deleteUsers, getUser, getUsers } from '../lib/db/queries/users.js';
import { readConfig } from '../config.js';
import { CommandHandler } from './commands.js';

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

export async function handlerRegister(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <user_name>`);
  }

  const userName = args[0];

  try {
    const record = await createUser(userName);

    setUser(record.name);
    console.log(`Successfully registered user ${record.name}`);
    console.log(record);
  } catch (error) {
    throw new Error(`User ${userName} is already registered`);
  }
}

export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
  const msg = 'Unable to reset the database';

  try {
    await deleteUsers();
  } catch (error) {
    throw new Error(msg);
  }

  const records = await getUsers();

  if (records.length > 0) {
    throw new Error(msg);
  }

  console.log('Successfully reset the database');
}
