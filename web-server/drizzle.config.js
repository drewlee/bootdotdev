import { defineConfig } from 'drizzle-kit';
import process from 'node:process';

process.loadEnvFile();

export default defineConfig({
  schema: 'src/db/schema.ts',
  out: 'src/db/out',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  },
});
