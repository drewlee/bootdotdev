import process from 'node:process';
import { defineConfig } from 'drizzle-kit';

process.loadEnvFile();

export default defineConfig({
  schema: 'src/db/schema.ts',
  out: 'src/db/out',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  },
});
