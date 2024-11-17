import BoardGame from 'jesusx21/boardGame';

import config from 'config';
import MoviesFreakAPI from './v1/resources';
import { Database } from 'database';
import { IMDB } from 'services/imdb/types';

export default class MoviesFreakApp extends BoardGame {
  constructor(host: string, port: number) {
    super(host, port)
  }

  initialize(database: Database, imdb: IMDB) {
    this.dependencies = { database, imdb };

    this.addCORSMiddleware()
      .setHeaders({
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': 'nosniff'
      })
      .setLogger()
      .buildAPI()
      .buildEndpoints();

    const format = this.isProductionEnv() ? 'combined' : 'dev';
    this.addRequestLogger(format);

    this.setUnexpectedErrorHandler();
    this.disablePoweredBy();

    return this;
  }

  protected setEndpointBase(): this {
    this.endpointBase = '/api/v1';

    return this;
  }

  protected buildAPI() {
    const moviesFreakAPI = new MoviesFreakAPI(this);

    moviesFreakAPI.buildAPI();

    return this;
  }

  protected isTestingEnv(): boolean {
    return config.isTestingEnv;
  }

  protected isDevelopmentEnv(): boolean {
    return config.isProductionEnv;
  }

  protected isProductionEnv(): boolean {
    return config.isProductionEnv;
  }
}
