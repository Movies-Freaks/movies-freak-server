import { Knex } from 'knex';
import { pick } from 'lodash';

import { Session } from '../../../app/moviesFreak/entities';
import { SessionNotFound } from '../errors';
import { SessionSerializer } from './serializers';
import { SQLDatabaseException } from './errors';
import { UUID } from '../../../typescript/customTypes';

interface sessionRecord {
  user_id?: UUID
}

class SQLSessionsStore {
  private connection: Knex;
  private database: any;

  constructor(connection: Knex, database: any) {
    this.connection = connection;
    this.database = database;
  }

  async create(session: Session) {
    const dataToInsert = this.serialize(session);

    let result: sessionRecord;

    try {
      [result] = await this.connection('sessions')
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  findActiveByUserId(userId: UUID) {
    return this.findOne({
      is_active: true,
      user_id: userId
    });
  }

  async update(session: Session) {
    const data = this.serialize(session);

    let result: sessionRecord;

    try {
      [result] = await this.connection('sessions')
        .returning('*')
        .where('id', session.id)
        .update({
          ...pick(data, ['token', 'expires_at', 'is_active']),
          updated_at: new Date()
        });
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new SessionNotFound({ id: session.id });
    }

    return this.deserialize(result);
  }

  private async findOne(query: {}) {
    let result: sessionRecord;

    try {
      result = await this.connection('sessions')
        .where(query)
        .orderBy('created_at', 'desc')
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new SessionNotFound(query);
    }

    return this.deserialize(result);
  }

  private serialize(session: Session): sessionRecord {
    const result = SessionSerializer.toJSON(session);

    return { ...result, user_id: session.user?.id };
  }

  private async deserialize(data: sessionRecord) {
    const session = SessionSerializer.fromJSON(data);
    session.user = await this.database.users.findById(data.user_id);

    return session;
  }
}

export default SQLSessionsStore;
