import AbstractMemoryStore from './abstractMemoryStore';
import { NotFound, SessionNotFound } from '../errors';
import { Session } from 'moviesFreak/entities';
import { UUID } from 'types';

export default class MemorySessionsStore extends AbstractMemoryStore<Session> {
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
}
