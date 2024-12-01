// Resources
import MovieResource from './movie';
import MoviesResource from './movies';
import WatchHubsResource from './watchHubs';

// Middlewares
import parseQuerySort from '../middlewares/parseQuerySort';
import WatchHubResource from './watchHub';

export default class MoviesFreakAPI {
  private app: any;

  constructor(app: any) {
    this.app = app;
  }

  buildAPI() {
    const movieResource = new MovieResource();
    const moviesResource = new MoviesResource();
    const watchHubResource = new WatchHubResource();
    const watchHubsResource = new WatchHubsResource();

    this.app.registerResource('/movies', moviesResource, [parseQuerySort]);
    this.app.registerResource('/movies/:movieId', movieResource);
    this.app.registerResource('/watchHubs', watchHubsResource, [parseQuerySort]);
    this.app.registerResource('/watchHubs/:watchHubId', watchHubResource);
  }
}
