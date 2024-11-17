import { isEmpty } from 'lodash';

import AbstractSQLStore from './abstractSQLStore';
import { Json, UUID } from 'types';
import { Sort, SortOrder } from '../types';
import { SQLDatabaseException } from './errors';
import { SQLTables } from './tables';
import { WatchHub } from 'moviesFreak/entities';
import { WatchHubNotFound } from '../errors';
import { WatchHubSerializer } from './serializers';

export default class SQLWatchHubsStore extends AbstractSQLStore<WatchHub> {
  async create(watchHub: WatchHub): Promise<WatchHub> {
    const dataToInsert = this.serialize(watchHub);

    let result: Json;

    try {
      [result] = await this.connection(SQLTables.WATCH_HUBS)
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  findById(watchHubId: UUID): Promise<WatchHub> {
    return this.findOne({ id: watchHubId });
  }

  async findAll(limit: number, skip: number, sort?: Sort) {
    if (isEmpty(sort)) {
      sort = { createdAt: SortOrder.ASC }
    }

    let items: Json[];

    try {
      items = await this.connection(SQLTables.WATCH_HUBS)
        .offset(skip)
        .limit(limit)
        .orderBy(this.serializeSort(sort));
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return {
      items: items.map(this.deserialize.bind(this)) as WatchHub[],
      totalItems: await this.count()
    };
  }

  async count() {
    try {
      const result = await this.connection(SQLTables.WATCH_HUBS)
        .count()
        .first();

      return Number(result.count ?? 0);
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }
  }

  protected async find(query: Json): Promise<WatchHub[]> {
    let items: Json[];

    try {
      items = await this.connection(SQLTables.WATCH_HUBS)
        .where(query)
        .orderBy('created_at');
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return items.map(this.deserialize.bind(this));
  }

  protected async findOne(query: Json): Promise<WatchHub> {
    let result: Json;

    try {
      result = await this.connection(SQLTables.WATCH_HUBS)
        .where(query)
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) throw new WatchHubNotFound(query);

    return this.deserialize(result);
  }

  protected deserialize(data: Json): WatchHub {
    return WatchHubSerializer.fromJson(data);
  }

  protected serialize(watchHub: WatchHub): Json {
    return WatchHubSerializer.toJson(watchHub);
  }
}
