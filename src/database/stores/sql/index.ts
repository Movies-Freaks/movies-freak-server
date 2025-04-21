import { Knex } from 'knex';

import SQLMoviesStore from './movies';
import SQLSessionsStore from './sessions';
import SQLUsersStore from './users';
import SQLWatchHubsCollaboratorsStore from './watchHubsCollaborators';
import SQLWatchHubsStore from './watchHubs';

export default class SQLDatabase {
  readonly connection: Knex;

  readonly movies: SQLMoviesStore;
  readonly sessions: SQLSessionsStore;
  readonly users: SQLUsersStore;
  readonly watchHubs: SQLWatchHubsStore;
  readonly watchHubsCollaborators: SQLWatchHubsCollaboratorsStore;

  constructor(connection: Knex) {
    this.connection = connection;

    this.movies = new SQLMoviesStore(this.connection);
    this.sessions = new SQLSessionsStore(this.connection);
    this.users = new SQLUsersStore(this.connection);
    this.watchHubs = new SQLWatchHubsStore(this.connection);
    this.watchHubsCollaborators = new SQLWatchHubsCollaboratorsStore(this.connection);
  }
}
