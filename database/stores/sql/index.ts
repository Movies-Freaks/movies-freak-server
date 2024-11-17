import { Knex } from 'knex';

import SQLMediaWatchlistsStore from './mediaWatchlist';
import SQLSessionsStore from './sessions';
import SQLTVEpisodeStore from './tvEpisodes';
import SQLTVSeasonStore from './tvSeason';
import SQLTVSeriesStore from './tvSeries';
import SQLUsersStore from './users';
import SQLWatchlistsStore from './watchlists';

class SQLDatabase {
  readonly connection: any;
  readonly mediaWatchlists: SQLMediaWatchlistsStore;
  readonly sessions: SQLSessionsStore;
  readonly tvEpisodes: SQLTVEpisodeStore;
  readonly tvSeasons: SQLTVSeasonStore;
  readonly tvSeries: SQLTVSeriesStore;
  readonly users: SQLUsersStore;
  readonly watchlists: SQLWatchlistsStore;

  constructor(connection: Knex) {
    this.connection = connection;

    this.mediaWatchlists = new SQLMediaWatchlistsStore(this.connection, this);
    this.sessions = new SQLSessionsStore(this.connection, this);
    this.tvEpisodes = new SQLTVEpisodeStore(this.connection);
    this.tvSeasons = new SQLTVSeasonStore(this.connection);
    this.tvSeries = new SQLTVSeriesStore(this.connection);
    this.users = new SQLUsersStore(this.connection);
    this.watchlists = new SQLWatchlistsStore(this.connection);
  }

  async withTransaction(fn: Function, ...args: any[]) {
    const transaction = await this.transaction();

    return fn(transaction, ...args);
  }

  private async transaction() {
    const connection = await this.connection.transaction();

    await connection.raw('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;');

    return new SQLTransactionDatabase(connection);
  }
}

class SQLTransactionDatabase extends SQLDatabase {
  async commit(response: any) {
    await this.connection.commit();

    return response;
  }

  async rollback(error: Error) {
    await this.connection.rollback();

    throw error;
  }
}

export default SQLDatabase;
