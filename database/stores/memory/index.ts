import InMemorySessionsStore from './session';
import InMemoryTVEpisodesStore from './tvEpisodes';
import InMemoryTVSeasonStore from './tvSeasons';
import InMemoryTVSeriesStore from './tvSeries';
import InMemoryUsersStore from './users';

class InMemoryDatabase {
  readonly sessions: InMemorySessionsStore;
  readonly tvEpisodes: InMemoryTVEpisodesStore;
  readonly tvSeasons: InMemoryTVSeasonStore;
  readonly tvSeries: InMemoryTVSeriesStore;
  readonly users: InMemoryUsersStore;

  constructor() {
    this.sessions = new InMemorySessionsStore();
    this.tvEpisodes = new InMemoryTVEpisodesStore();
    this.tvSeasons = new InMemoryTVSeasonStore();
    this.tvSeries = new InMemoryTVSeriesStore();
    this.users = new InMemoryUsersStore();
  }

  async withTransaction(fn: Function, ...args: any[]) {
    return fn(this, ...args);
  }
}

export default InMemoryDatabase;
