import MemoryMoviesStore from './movies';
import MemoryWatchHubsStore from './watchHubs';

export default class MemoryDatabase {
  readonly movies: MemoryMoviesStore;
  readonly watchHubs: MemoryWatchHubsStore;

  constructor() {
    this.movies = new MemoryMoviesStore();
    this.watchHubs = new MemoryWatchHubsStore();
  }
}
