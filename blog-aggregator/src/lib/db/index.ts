import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema.js';
import { readConfig } from '../../config.js';

const config = readConfig();
const conn = postgres(config.dbUrl);
const db = drizzle(conn, { schema });

export { db };
