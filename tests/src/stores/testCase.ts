import knex, { Knex } from 'knex';
import knexCleaner, { KnexCleanerOptions } from 'knex-cleaner';

import TestCase from '../testCase';

import config from 'config';
import knexConfig from '../../../knexfile';
import SQLDatabase from 'database/stores/sql';
import { Database } from 'database';
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
    if (!config.isTestingEnv) return;
    if (!this.connection) return;

    const knexCleanerConfig: KnexCleanerOptions = {
      mode: 'delete',
      ignoreTables: [
        'knex_migrations',
        'knex_migrations_lock',
        'knex_migrations_id_seq',
      ]
    };

    await knexCleaner.clean(this.connection, knexCleanerConfig);
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

  getDatabase(): Database {
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
