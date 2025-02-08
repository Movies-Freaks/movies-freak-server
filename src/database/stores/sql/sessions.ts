import { isNil } from 'lodash';

import AbstractSQLStore from './abstractSQLStore';
import { Json, UUID } from 'types';
import { Session } from 'moviesFreak/entities';
import { SessionSerializer } from './serializers';
import { Sort, SortOrder } from '../types';
import { SQLDatabaseException } from './errors';
import { SQLTables } from './tables';
import {
  NotFound,
  SessionNotFound,
  TokenAlreadyUsed,
  UserNotFound
} from '../errors';

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

  findByToken(token: string): Promise<Session> {
    return this.findOne(
      SQLTables.SESSIONS,
      { token }
    );
  }

  findLatestActiveByUserId(userId: UUID) {
    return this.findOne(
      SQLTables.SESSIONS,
      { is_active: true, user_id: userId },
      { created_at: SortOrder.DESC }
    );
  }

  async update(session: Session): Promise<Session> {
    let result: Json;

    try {
      [result] = await this.connection(SQLTables.SESSIONS)
        .update({
          token: session.token,
          expires_at: session.expiresAt,
          is_active: session.isActive,
          updated_at: session.updatedAt
        })
        .where('id', session.id)
        .returning('*');
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (isNil(result)) throw new SessionNotFound({ id: session.id });

    return this.deserialize(result);
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
