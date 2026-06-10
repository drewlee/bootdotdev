import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CONFIG_NAME = '.gatorconfig.json';

type Config = {
  dbUrl: string;
  currentUserName: string;
};

function getConfigFilePath(): string {
  const homeDir = os.homedir();
  const configPath = path.join(homeDir, CONFIG_NAME);

  return configPath;
}

function toCamelCase(value: string): string {
  let result = '';

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === '_') {
      continue;
    }

    result += i > 0 && value[i - 1] === '_' ? char.toUpperCase() : char;
  }

  return result;
}

function toSnakeCase(value: string): string {
  let result = '';

  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    result += char === char.toUpperCase() ? `_${char.toLowerCase()}` : char;
  }

  return result;
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== 'string') {
    throw new Error('db_url is required in config file');
  }

  if (!rawConfig.current_user_name || typeof rawConfig.current_user_name !== 'string') {
    throw new Error('current_user_name is required in config file');
  }

  const config: Record<string, string> = {};

  for (const key of Object.keys(rawConfig)) {
    config[toCamelCase(key)] = rawConfig[key];
  }

  return config as Config;
}

function writeConfig(config: Config): void {
  const configPath = getConfigFilePath();
  const rawConfig: Record<string, string> = {};

  for (const key of Object.keys(config)) {
    rawConfig[toSnakeCase(key)] = config[key as keyof Config];
  }

  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(configPath, data, { encoding: 'utf8' });
}

export function setUser(user: string): void {
  const config = readConfig();
  config.currentUserName = user;

  writeConfig(config);
}

export function readConfig(): Config {
  const configPath = getConfigFilePath();

  if (!fs.existsSync(configPath)) {
    throw new Error(`config file not found at ${configPath}`);
  }

  const result = fs.readFileSync(configPath, { encoding: 'utf8' });
  const rawConfig = JSON.parse(result);
  const config = validateConfig(rawConfig);

  return config;
}
