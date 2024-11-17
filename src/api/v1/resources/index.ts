import MoviesResource from './movies';

export default class MoviesFreakAPI {
  private app: any;

  constructor(app: any) {
    this.app = app;
  }

  buildAPI() {
    const moviesResource = new MoviesResource();

    this.app.registerResource('movies', moviesResource);
  }
}
