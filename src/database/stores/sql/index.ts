import { Knex } from 'knex';

import SQLMoviesStore from './movies';

export default class SQLDatabase {
  readonly connection: Knex;

  readonly movies: SQLMoviesStore;

  constructor(connection: Knex) {
    this.connection = connection;

    this.movies = new SQLMoviesStore(this.connection);
  }
}
