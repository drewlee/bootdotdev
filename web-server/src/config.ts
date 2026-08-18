import process from 'node:process';
import type { MigrationConfig } from 'drizzle-orm/migrator';

process.loadEnvFile();

type APIConfig = {
  fileServerHits: number;
  platform: string;
  port: number;
  polkaKey: string;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

type JWTConfig = {
  defaultDuration: number;
  refreshDuration: number;
  secret: string;
  issuer: string;
};

type Config = {
  api: APIConfig;
  db: DBConfig;
  jwt: JWTConfig;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: './src/db/out',
};

/**
 * Returns the specified environment variable value. Throws an error
 * if the variable is not set.
 *
 * @param key - Environment variable key.
 * @returns Environment variable value.
 */
function envOrThrow(key: string): string {
  if (process.env[key]) {
    return process.env[key];
  }
  throw new Error(`Environment variable ${key} is not set`);
}

const config: Config = {
  api: {
    fileServerHits: 0,
    platform: envOrThrow('PLATFORM'),
    port: Number(envOrThrow('PORT')),
    polkaKey: envOrThrow('POLKA_KEY'),
  },
  db: {
    url: envOrThrow('DB_URL'),
    migrationConfig,
  },
  jwt: {
    defaultDuration: 60 * 60, // 1 hour in seconds
    refreshDuration: 1000 * 60 * 60 * 24 * 60, // 60 days in milliseconds
    secret: envOrThrow('JWT_SECRET'),
    issuer: 'chirpy',
  },
};

export default config;
