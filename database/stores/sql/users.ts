import { Knex } from 'knex';

import { SQLDatabaseException } from './errors';
import { UserNotFound} from '../errors';
import { UserSerializer } from './serializers';

interface userRecord {
  password_hash?: string;
  password_salt?: string;
}

class SQLUsersStore {
  private connection: Knex;

  constructor(connection: Knex) {
    this.connection = connection;
  }

  async findByEmail(email: string) {
    return this.findOne({ email });
  }

  async findByUsername(username: string) {
    return this.findOne({ username });
  }

  private async findOne(query: {}) {
    let result: userRecord;

    try {
      result = await this.connection('users')
        .where(query)
        .first();
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new UserNotFound(query);
    }

    return this.deserialize(result);
  }

  private deserialize(data: userRecord) {
    const user = UserSerializer.fromJSON(data);

    user.password = {
      hash: data.password_hash,
      salt: data.password_salt
    };

    return user;
  }
}

export default SQLUsersStore;
