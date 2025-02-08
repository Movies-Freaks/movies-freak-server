import AbstractSQLStore from './abstractSQLStore';
import { Json, UUID } from 'types';
import { Session } from 'moviesFreak/entities';
import { NotFound, SessionNotFound, TokenAlreadyUsed, UserNotFound } from '../errors';
import { SessionSerializer } from './serializers';
import { SQLDatabaseException } from './errors';
import { SQLTables } from './tables';
import { Sort } from '../types';

export default class SQLSessionsStore extends AbstractSQLStore<Session> {
  async create(session: Session) {
    const dataToInsert = this.serialize(session);

    let result: Json;

    try {
      [result] = await this.connection(SQLTables.SESSIONS)
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      if (error.constraint === 'sessions_token_unique') {
        throw new TokenAlreadyUsed(session.token);
      }
      if (error.constraint === 'sessions_user_id_foreign') {
        throw new UserNotFound(session.userId);
      }

      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  findById(sessionId: UUID): Promise<Session> {
    return this.findOne(SQLTables.SESSIONS, { id: sessionId });
  }

  findActiveSessionByToken(token: string): Promise<Session> {
    return this.findOne(
      SQLTables.SESSIONS,
      { token, is_active: false }
    );
  }

  protected async find(query: Json): Promise<Session[]> {
    let items: Json[];

    try {
      items = await this.connection(SQLTables.SESSIONS)
        .where(query)
        .orderBy('created_at');
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return items.map(this.deserialize.bind(this));
  }

  protected async findOne(tableName: SQLTables, filter: Json, sort?: Sort): Promise<Session> {
    try {
      return await super.findOne(tableName, filter, sort);
    } catch (error) {
      if (error instanceof NotFound) throw new SessionNotFound(filter);

      throw new SQLDatabaseException(error);
    }
  }

  protected deserialize(data: Json): Session {
    return SessionSerializer.fromJson(data);
  }

  protected serialize(session: Session): Json {
    return SessionSerializer.toJson(session);
  }
}
