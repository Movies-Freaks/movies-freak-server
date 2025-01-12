import Store from './store';
import { NotFound, SessionNotFound } from '../errors';
import { Session } from '../../../app/moviesFreak/entities';
import { UUID } from '../../../types/common';

class InMemorySessionsStore {
  private store: Store<Session>;

  constructor() {
    this.store = new Store<Session>();
  }

  async findActiveByUserId(userId: UUID) {
    try {
      return await this.store.findOne({ 'user.id': userId });
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new SessionNotFound(userId);
      }

      throw error;
    }
  }

  async findCurrentSessionByToken(token: string) {
    try {
      return await this.store.findOne({ token });
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new SessionNotFound(token);
      }

      throw error;
    }
  }

  async update(session: Session) {
    let sessionToUpdate: Session;

    try {
      return await this.store.update(session);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new SessionNotFound({ id: session.id });
      }

      throw error;
    }
  }
}

export default InMemorySessionsStore;
