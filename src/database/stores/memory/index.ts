import MemoryMoviesStore from './movies';
import MemorySessionsStore from './sessions';
import MemoryUsersStore from './users';
import MemoryWatchHubsStore from './watchHubs';

export default class MemoryDatabase {
  readonly movies: MemoryMoviesStore;
  readonly sessions: MemorySessionsStore;
  readonly users: MemoryUsersStore;
  readonly watchHubs: MemoryWatchHubsStore;

  constructor() {
    this.movies = new MemoryMoviesStore();
    this.sessions = new MemorySessionsStore();
    this.users = new MemoryUsersStore();
    this.watchHubs = new MemoryWatchHubsStore();
  }
}
