import knex, { Knex } from 'knex';
import knexCleaner from 'knex-cleaner';

import knexConfig from '../../../knexfile';
import SQLDatabase from 'database/stores/sql';
import TestCase from '../testCase';
import { Env } from 'config/types';

export default class SQLTestCase extends TestCase {
  protected connection: Knex;
  protected database: SQLDatabase;

  setUp() {
    super.setUp();

    this.buildDatabaseConnection();
    this.buildDatabase();
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }

  async cleanDatabase() {
    if (!this.connection) {
      return;
    }

    await knexCleaner.clean(this.connection as any);
    this.connection.destroy();

    this.connection = undefined;
    this.database = undefined;
  }

  buildDatabase(): SQLDatabase {
    if (this.database) {
      return this.database;
    }

    this.buildDatabaseConnection();
    this.database = new SQLDatabase(this.connection);

    return this.database;
  }

  buildDatabaseConnection() {
    if (this.connection) {
      return this.connection;
    }

    const config = knexConfig[Env.TESTING];
    this.connection = knex(config);

    return this.connection;
  }
}
