import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import config from './config.js';
import app from './app.js';

const PORT = config.api.port;
const migrationClient = postgres(config.db.url, { max: 1 });

await migrate(drizzle(migrationClient), config.db.migrationConfig);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
