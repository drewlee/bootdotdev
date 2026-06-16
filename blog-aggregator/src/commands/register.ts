import { createUser } from '../lib/db/queries/users.js';
import { setUser } from '../config.js';

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
