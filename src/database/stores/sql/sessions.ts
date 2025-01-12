import AbstractSQLStore from './abstractSQLStore';
import { Json, UUID } from 'types';
import { Session } from 'moviesFreak/entities';
import { SessionNotFound, TokenAlreadyUsed, UserNotFound } from 'database/stores/errors';
import { SessionSchema } from 'database/schemas';
import { SessionSerializer } from './serializers';
import { SQLDatabaseException } from './errors';
import { SQLTables } from './tables';

export default class SQLSessionsStore extends AbstractSQLStore<SessionSchema> {
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
    return this.findOne({ id: sessionId });
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

  protected async findOne(query: Json): Promise<Session> {
    let result: Json;

    try {
      result = await this.connection(SQLTables.SESSIONS)
        .where(query)
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) throw new SessionNotFound(query);

    return this.deserialize(result);
  }

  protected deserialize(data: Json): Session {
    return SessionSerializer.fromJson(data);
  }

  protected serialize(session: Session): Json {
    return SessionSerializer.toJson(session);
  }
}
