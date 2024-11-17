export enum DatabaseDriver {
  MEMORY = 'memory',
  SQL = 'sql'
}

export enum Env {
  CI = 'ci',
  DEVELOP = 'develop',
  PRODUCTION = 'production',
  STAGING = 'staging',
  TESTING = 'test',
};

export type DatabaseConfig = {
  driver: DatabaseDriver
};

export type ServerConfig = {
  host: string,
  port: number,
  secretKey: string
};

export type Config = {
  database: DatabaseConfig,
  env: Env,
  isDevelopEnv: boolean,
  isProductionEnv: boolean,
  isTestingEnv: boolean,
  server: ServerConfig
};
