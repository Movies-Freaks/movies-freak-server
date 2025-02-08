import InMemoryTVEpisodesStore from './tvEpisodes';
import InMemoryTVSeasonStore from './tvSeasons';
import InMemoryTVSeriesStore from './tvSeries';

class InMemoryDatabase {
  readonly tvEpisodes: InMemoryTVEpisodesStore;
  readonly tvSeasons: InMemoryTVSeasonStore;
  readonly tvSeries: InMemoryTVSeriesStore;

  constructor() {
    this.tvEpisodes = new InMemoryTVEpisodesStore();
    this.tvSeasons = new InMemoryTVSeasonStore();
    this.tvSeries = new InMemoryTVSeriesStore();
  }

  async withTransaction(fn: Function, ...args: any[]) {
    return fn(this, ...args);
  }
}

export default InMemoryDatabase;
