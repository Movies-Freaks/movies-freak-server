import { Knex } from 'knex';

type knexConfig = {
  test: Knex.Config;
  ci: Knex.Config;
  develop: Knex.Config;
  staging: Knex.Config;
  production: Knex.Config;
};

const knexConfig: knexConfig = {
  test: {
    client: 'postgres',
    connection: {
      database: 'movies_freak_test',
      user: 'postgres',
      password: 'postgres'
    }
  },
  ci: {
    client: 'postgres',
    connection: {
      database: 'movies_freak_test',
      user: 'postgres',
      password: 'postgres'
    }
  },
  develop: {
    client: 'postgres',
    connection: {
      database: 'movies_freak_dev',
      user: 'postgres'
    }
  },
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};

export default knexConfig;
