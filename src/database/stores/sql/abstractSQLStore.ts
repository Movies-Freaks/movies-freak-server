import { Knex } from 'knex';

import AbstractStore from '../abstractStore';
import { Json } from 'types';
import { Sort } from '../types';
import { snakeCase } from 'lodash';

export default abstract class AbstractSQLStore<T> extends AbstractStore<T> {
  protected connection: Knex;

  constructor(connection: Knex) {
    super();

    this.connection = connection;
  }

  protected serializeSort(sort: Sort) {
    return Object.keys(sort)
      .map((field) => {
        return {
          column: snakeCase(field),
          order: sort[field]
        };
      });
  }

  protected abstract deserialize(data: Json): T;
  protected abstract serialize(entity: T): Json;
}
