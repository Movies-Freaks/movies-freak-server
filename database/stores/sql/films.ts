import { Knex } from 'knex';

import { Film } from '../../../app/moviesFreak/entities';
import { SQLDatabaseException } from './errors';
import { QueryOptions, QueryResponse } from '../../../types/database';

class SQLFilmsStore {
  private connection: Knex;

  constructor(connection: Knex) {
    this.connection = connection;
  }


  async find(options: QueryOptions = {}): Promise<QueryResponse<Film>> {
    let items: {}[];

    try {
      const query = this.connection('films');

      if (options.skip) {
        query.offset(options.skip);
      }

      if (options.limit) {
        query.limit(options.limit);
      }

      items = await query.orderBy('created_at');
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }

    return {
      items: items.map(this.deserialize.bind(this)),
      totalItems: await this.count()
    };
  }

  async count() {
    try {
      const result = await this.connection('films')
        .count()
        .first();

      if (!result) {
        return 0;
      }

      return Number(result.count);
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }
  }

  private deserialize(data: {}) {
    return data;
  }
}

export default SQLFilmsStore;
