import { Knex } from 'knex';

import AbstractStore from '../abstractStore';
import { Json } from 'types';

export default abstract class AbstractSQLStore<T> extends AbstractStore<T> {
  protected connection: Knex;

  constructor(connection: Knex) {
    super();

    this.connection = connection;
  }

  protected abstract deserialize(data: Json): T;
  protected abstract serialize(entity: T): Json;
}
