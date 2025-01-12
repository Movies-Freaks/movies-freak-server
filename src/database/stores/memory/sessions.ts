import AbstractMemoryStore from './abstractMemoryStore';
import { NotFound, SessionNotFound, TokenAlreadyUsed } from '../errors';
import { Session } from 'moviesFreak/entities';
import { UUID } from 'types';

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

  async findActiveSessionByToken(token: string): Promise<Session> {
    try {
      return await this.findOne({
        token,
        isActive: true
      });
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new SessionNotFound({ token });
      }

      throw error;
    }
  }
}
