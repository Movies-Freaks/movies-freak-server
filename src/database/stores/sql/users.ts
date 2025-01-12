import AbstractSQLStore from './abstractSQLStore';
import { EmailAlreadyExists, UsernameAlreadyExists, UserNotFound } from '../errors';
import { Json, UUID } from 'types';
import { SQLDatabaseException } from './errors';
import { SQLTables } from './tables';
import { User } from 'moviesFreak/entities';
import { UserSerializer } from './serializers';

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
    return this.findOne({ id: userId });
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

  protected async findOne(query: Json): Promise<User> {
    let result: Json;

    try {
      result = await this.connection(SQLTables.USERS)
        .where(query)
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) throw new UserNotFound(query);

    return this.deserialize(result);
  }

  protected deserialize(data: Json): User {
    return UserSerializer.fromJson(data);
  }

  protected serialize(user: User): Json {
    const result = UserSerializer.toJson(user);

    result.password_salt = user.password.salt;
    result.password_hash = user.password.hash;

    return result;
  }
}
