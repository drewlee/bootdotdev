import process from 'node:process';

process.loadEnvFile();

function envOrThrow(key: string): string {
  if (process.env[key]) {
    return process.env[key];
  }

  throw new Error(`Missing key ${key} environment variable`);
}

type APIConfig = {
  fileServerHits: number;
  dbURL: string;
};

export const config: APIConfig = {
  fileServerHits: 0,
  dbURL: envOrThrow('DB_URL'),
};
