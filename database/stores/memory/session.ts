import Store from './store';
import { NotFound, SessionNotFound } from '../errors';
import { Session } from '../../../app/moviesFreak/entities';
import { UUID } from '../../../types/common';

class InMemorySessionsStore {
  private store: Store<Session>;

  constructor() {
    this.store = new Store<Session>();
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
