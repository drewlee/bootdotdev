import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CONFIG_NAME = '.gatorconfig.json';

type Config = {
  dbUrl: string;
  currentUserName: string;
};

/**
 * Builds the absolute path to the config file in the user's home directory.
 *
 * @returns The config file path.
 */
function getConfigFilePath(): string {
  const homeDir = os.homedir();
  const configPath = path.join(homeDir, CONFIG_NAME);

  return configPath;
}

/**
 * Converts a snake_case string to camelCase.
 *
 * @param value - snake_case string to convert.
 * @returns The camelCase string.
 */
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

/**
 * Converts a camelCase string to snake_case.
 *
 * @param value - camelCase string to convert.
 * @returns The snake_case string.
 */
function toSnakeCase(value: string): string {
  let result = '';

  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    result += char === char.toUpperCase() ? `_${char.toLowerCase()}` : char;
  }

  return result;
}

/**
 * Validates the raw config object and converts its keys to camelCase.
 *
 * @param rawConfig - Parsed config object with snake_case keys.
 * @returns The validated config with camelCase keys.
 */
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

/**
 * Writes the config to disk, converting its keys back to snake_case.
 *
 * @param config - Config to persist.
 */
function writeConfig(config: Config): void {
  const configPath = getConfigFilePath();
  const rawConfig: Record<string, string> = {};

  for (const key of Object.keys(config)) {
    rawConfig[toSnakeCase(key)] = config[key as keyof Config];
  }

  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(configPath, data, { encoding: 'utf8' });
}

/**
 * Sets the current user name in the config and persists it to disk.
 *
 * @param user - User name to set as current.
 */
export function setUser(user: string): void {
  const config = readConfig();
  config.currentUserName = user;

  writeConfig(config);
}

/**
 * Reads and validates the config file from disk.
 *
 * @returns The validated config.
 */
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
