import { isNil, set } from 'lodash';

import AbstractMemoryStore from './abstractMemoryStore';
import { Json, UUID } from 'types';
import { NotFound, SessionNotFound, TokenAlreadyUsed } from '../errors';
import { Session } from 'moviesFreak/entities';
import { Sort, SortOrder } from '../types';

export default class MemorySessionsStore extends AbstractMemoryStore<Session> {
  async create(session: Session) {
    try {
      await this.findOne({ token: session.token });

      throw new TokenAlreadyUsed(session.token);
    } catch (error) {
      if (!(error instanceof NotFound)) throw error;
    }

    return super.create(session);
  }

  async findById(sessionId: UUID) {
    try {
      return await super.findById(sessionId);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new SessionNotFound({ id: sessionId });
      }

      throw error;
    }
  }

  async findByToken(token: string): Promise<Session> {
    try {
      return await this.findOne({ token });
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new SessionNotFound({ token });
      }

      throw error;
    }
  }

  findLatestActiveByUserId(userId: UUID) {
    return this.findOne(
      { isActive: true, userId: userId },
      { createdAt: SortOrder.DESC }
    );
  }

  async update(session: Session): Promise<Session> {
    if (isNil(this.items[session.id])) throw new SessionNotFound({ id: session.id });

    set(session, 'updatedAt', new Date());

    this.items[session.id] = session;

    return session;
  }

  protected async findOne(filter: Json, sort?: Sort): Promise<Session> {
    try {
      return await super.findOne(filter, sort);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new SessionNotFound({ filter, sort });
      }

      throw error;
    }
  }
}
