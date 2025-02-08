import { set } from 'lodash';

import AbstractSQLStore from './abstractSQLStore';
import { Json, UUID } from 'types';
import { Sort } from '../types';
import { SQLDatabaseException } from './errors';
import { SQLTables } from './tables';
import { User, UserPassword } from 'moviesFreak/entities';
import { UserSerializer } from './serializers';
import {
  EmailAlreadyExists,
  NotFound,
  UsernameAlreadyExists,
  UserNotFound
} from '../errors';

export default class SQLUsersStore extends AbstractSQLStore<User> {
  async create(user: User): Promise<User> {
    const dataToInsert = this.serialize(user);

    let result: Json;

    try {
      [result] = await this.connection(SQLTables.USERS)
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      if (error.constraint === 'users_username_unique') {
        throw new UsernameAlreadyExists(user.username);
      }
      if (error.constraint === 'users_email_unique') {
        throw new EmailAlreadyExists(user.email);
      }

      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  findById(userId: UUID): Promise<User> {
    return this.findOne(SQLTables.USERS, { id: userId });
  }

  findByEmail(email: string): Promise<User> {
    return this.findOne(SQLTables.USERS, { email });
  }

  findByUsername(username: string): Promise<User> {
    return this.findOne(SQLTables.USERS, { username });
  }

  protected async find(query: Json): Promise<User[]> {
    let items: Json[];

    try {
      items = await this.connection(SQLTables.USERS)
        .where(query)
        .orderBy('created_at');
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return items.map(this.deserialize.bind(this));
  }

  protected async findOne(tableName: SQLTables, filter: Json, sort?: Sort): Promise<User> {
    try {
      return await super.findOne(tableName, filter, sort);
    } catch (error) {
      if (error instanceof NotFound) throw new UserNotFound(filter);

      throw new SQLDatabaseException(error);
    }
  }

  protected deserialize(data: Json): User {
    const user = UserSerializer.fromJson(data);
    const password = new UserPassword({
      hash: data.password_hash,
      salt: data.password_salt
    });

    set(user, 'userPassword', password);

    return user;
  }

  protected serialize(user: User): Json {
    const result = UserSerializer.toJson(user);

    result.password_salt = user.password.salt;
    result.password_hash = user.password.hash;

    return result;
  }
}
