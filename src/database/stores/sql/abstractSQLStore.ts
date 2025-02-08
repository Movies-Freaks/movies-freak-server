import { isNil, snakeCase } from 'lodash';
import { Knex } from 'knex';

import AbstractStore from '../abstractStore';
import { Json } from 'types';
import { NotFound } from '../errors';
import { Sort } from '../types';
import { SQLDatabaseException } from './errors';
import { SQLTables } from './tables';

export default abstract class AbstractSQLStore<T> extends AbstractStore<T> {
  protected connection: Knex;

  constructor(connection: Knex) {
    super();

    this.connection = connection;
  }

  protected abstract deserialize(data: Json): T;
  protected abstract serialize(entity: T): Json;

  protected serializeSort(sort: Sort) {
    return Object.keys(sort)
      .map((field) => {
        return {
          column: snakeCase(field),
          order: sort[field]
        };
      });
  }

  protected async findOne(tableName: SQLTables, filter: Json, sort?: Sort): Promise<T> {
    let result: Json;

    try {
      const queryBuilder = this.connection(tableName)
        .where(filter);

      if (!isNil(sort)) {
        queryBuilder.orderBy(this.serializeSort(sort))
      }

      result = await queryBuilder.first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) throw new NotFound(filter);

    return this.deserialize(result);
  }
}
