import MoviesResource from './movies';
import WatchHubsResource from './watchHubs';

export default class MoviesFreakAPI {
  private app: any;

  constructor(app: any) {
    this.app = app;
  }

  buildAPI() {
    const moviesResource = new MoviesResource();
    const watchHubsResource = new WatchHubsResource();

    this.app.registerResource('/movies', moviesResource);
    this.app.registerResource('/watchHubs', watchHubsResource);
  }
}
