import TVSerieResource from './tvSerie';
import TVSeriesResource from './tvSeries';

class MoviesFreakAPI {
  private app: any;

  constructor(app: any) {
    this.app = app;
  }

  buildAPI() {
    const tvSerieResource = new TVSerieResource();
    const tvSeriesResource = new TVSeriesResource();

    this.app.registerResource('tv-series', tvSeriesResource);
    this.app.registerResource('tv-series/:tvSerieId', tvSerieResource);
  }
}

export default MoviesFreakAPI;
