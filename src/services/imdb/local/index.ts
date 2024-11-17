import LocalMovieResult from './movieResult';

export default class LocalIMDBGateway {
  async fetchMovieById(_imdbI: string) {
    return new LocalMovieResult();
  }
}
