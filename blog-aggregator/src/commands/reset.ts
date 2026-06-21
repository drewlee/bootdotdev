import { deleteUsers, getUsers } from '../lib/db/queries/users.js';

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
