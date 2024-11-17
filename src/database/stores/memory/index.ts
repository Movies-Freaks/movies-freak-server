import MemoryMoviesStore from './movies';

export default class MemoryDatabase {
  readonly movies: MemoryMoviesStore;

  constructor() {
    this.movies = new MemoryMoviesStore();
  }
}
