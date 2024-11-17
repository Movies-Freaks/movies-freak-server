import knex from 'knex';

import knexConfig from '../../knexfile';
import MemoryDatabase from './stores/memory';
import SQLDatabase from './stores/sql';
import { DatabaseDriver, Env } from 'config/types';
import { DatabaseDriverNotSupported } from './errors';

export type Database = MemoryDatabase | SQLDatabase;

export default function getDatabase(driverName: DatabaseDriver, env?: Env): Database {
  if (driverName === DatabaseDriver.MEMORY) {
    return new MemoryDatabase();
  }

  if (driverName === DatabaseDriver.SQL) {
    const config = knexConfig[env];
    const connection = knex(config);

    return new SQLDatabase(connection);
  }

  throw new DatabaseDriverNotSupported(driverName);
}
