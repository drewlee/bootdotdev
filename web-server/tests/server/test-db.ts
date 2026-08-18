import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { pushSchema } from 'drizzle-kit/api';
import * as schema from 'src/db/schema.js';

const client = new PGlite();
const testDB = drizzle({ client });

const { apply } = await pushSchema(schema, testDB);
await apply();

export { testDB };
