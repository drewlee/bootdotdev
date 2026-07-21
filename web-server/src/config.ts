import process from 'node:process';
import type { MigrationConfig } from 'drizzle-orm/migrator';

process.loadEnvFile();

type APIConfig = {
  fileServerHits: number;
  platform: string;
  port: number;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type Config = {
  api: APIConfig;
  db: DBConfig;
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: './src/db/out',
};

function envOrThrow(key: string): string {
  if (process.env[key]) {
    return process.env[key];
  }
  throw new Error(`Missing key ${key} environment variable`);
}

export const config: Config = {
  api: {
    fileServerHits: 0,
    platform: envOrThrow('PLATFORM'),
    port: Number(envOrThrow('PORT')),
  },
  db: {
    url: envOrThrow('DB_URL'),
    migrationConfig,
  },
};
