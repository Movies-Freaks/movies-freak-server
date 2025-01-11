import SignIn from './signIn';
import SignUp from './signUp';
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

    const signIn = new SignIn();
    const signUp = new SignUp();

    this.app.registerResource('tv-series', tvSeriesResource);
    this.app.registerResource('tv-series/:tvSerieId', tvSerieResource);
    this.app.registerResource('sign-in', signIn);
    this.app.registerResource('sign-up', signUp);
  }
}

export default MoviesFreakAPI;
