import { config as dotenv } from 'dotenv';

import { Config, Env } from './types';

const { env } = process;
let nodeEnv: Env;

switch (env.NODE_ENV) {
  case 'ci':
    nodeEnv = Env.CI;
    break;
  case 'develop':
    nodeEnv = Env.DEVELOP;
    break;
  case 'production':
    nodeEnv = Env.PRODUCTION;
    break;
  case 'staging':
    nodeEnv = Env.STAGING;
    break;
  case 'test':
    nodeEnv = Env.TESTING;
    break;
  default:
    nodeEnv = Env.DEVELOP;
}

dotenv({ path: `.env/${nodeEnv}.env` });

const isDevelopEnv = Env.DEVELOP === nodeEnv;
const isProductionEnv = [Env.PRODUCTION, Env.STAGING].includes(nodeEnv);
const isTestingEnv = [Env.TESTING, Env.CI].includes(nodeEnv);

const config = Object.freeze({
  isDevelopEnv,
  isProductionEnv,
  isTestingEnv,
  env: nodeEnv,
  database: { driver: env.DATABASE_DRIVER },
  imdb: {
    driver: env.IMDB_DRIVER,
    omdb: {
      host: env.OMDB_HOST,
      apiKey: env.OMDB_API_KEY
    }
  },
  server: {
    host: env.HOST,
    port: Number(env.PORT)
  }
});

export default config as Config;
