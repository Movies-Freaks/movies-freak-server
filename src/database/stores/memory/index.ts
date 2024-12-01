import MemoryMoviesStore from './movies';
import MemoryUsersStore from './users';
import MemoryWatchHubsStore from './watchHubs';

export default class MemoryDatabase {
  readonly movies: MemoryMoviesStore;
  readonly users: MemoryUsersStore;
  readonly watchHubs: MemoryWatchHubsStore;

  constructor() {
    this.movies = new MemoryMoviesStore();
    this.users = new MemoryUsersStore();
    this.watchHubs = new MemoryWatchHubsStore();
  }
}
