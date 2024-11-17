import { Database } from 'database';
import BoardGame from 'jesusx21/boardGame';
import MoviesFreakAPI from './v1/resources';
import { IMDB } from 'services/imdb/types';
import config from 'config';

export default class MoviesFreakApp extends BoardGame {
  constructor(host: string, port: number) {
    super(host, port)
  }

  initialize(database: Database, imdb: IMDB) {
    this.dependencies = { database, imdb };

    this.addJsonMiddleware()
      .addCORSMiddleware()
      .setLogger()
      .setHeaders({
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': 'nosniff'
      })
      .buildAPI()
      .buildEndpoints();

    if (!this.isTestingEnv()) {
      const format = this.isProductionEnv() ? 'combined' : 'dev';

      this.addRequestLogger(format);
    }

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
