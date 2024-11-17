export enum DatabaseDriver {
  MEMORY = 'memory',
  SQL = 'sql'
};

export enum Env {
  CI = 'ci',
  DEVELOP = 'develop',
  PRODUCTION = 'production',
  STAGING = 'staging',
  TESTING = 'test',
};

export enum IMDBDriver {
  OMDB = 'omdb',
  LOCAL = 'local'
};

export type DatabaseConfig = {
  driver: DatabaseDriver
};

export type OMDBConfig = {
  host: string,
  apiKey: string
};

export type IMDBConfig = {
  driver: IMDBDriver,
  omdb?: OMDBConfig
};

export type ServerConfig = {
  host: string,
  port: number,
  secretKey: string
};

export type Config = {
  database: DatabaseConfig,
  env: Env,
  imdb: IMDBConfig,
  isDevelopEnv: boolean,
  isProductionEnv: boolean,
  isTestingEnv: boolean,
  server: ServerConfig
};
