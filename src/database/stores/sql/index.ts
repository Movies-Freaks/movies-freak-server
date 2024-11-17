import { Knex } from 'knex';

import SQLMoviesStore from './movies';
import SQLWatchHubsStore from './watchHubs';

export default class SQLDatabase {
  readonly connection: Knex;

  readonly movies: SQLMoviesStore;
  readonly watchHubs: SQLWatchHubsStore;

  constructor(connection: Knex) {
    this.connection = connection;

    this.movies = new SQLMoviesStore(this.connection);
    this.watchHubs = new SQLWatchHubsStore(this.connection);
  }
}
