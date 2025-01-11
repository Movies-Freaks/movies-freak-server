// Resources
import MovieResource from './movie';
import MoviesResource from './movies';
import WatchHubsResource from './watchHubs';

// Middlewares
import parseQuerySort from '../middlewares/parseQuerySort';

export default class MoviesFreakAPI {
  private app: any;

  constructor(app: any) {
    this.app = app;
  }

  buildAPI() {
    const movieResource = new MovieResource();
    const moviesResource = new MoviesResource();
    const watchHubsResource = new WatchHubsResource();

    this.app.registerResource('/movies', moviesResource, [parseQuerySort]);
    this.app.registerResource('/movies/:movieId', movieResource);
    this.app.registerResource('/watchHubs', watchHubsResource, [parseQuerySort]);
  }
}
