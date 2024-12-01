import Store from './store';
import { User } from '../../../app/moviesFreak/entities';
import { NotFound, UserNotFound } from '../errors';

class InMemoryUsersStore {
  private store: Store<User>;

  constructor() {
    this.store = new Store<User>();
  }

  async findByEmail(email: string) {
    try {
      return await this.store.findOne({ email });
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new UserNotFound({ email });
      }

      throw error;
    }
  }

  async findByUsername(username: string) {
    try {
      return await this.store.findOne({ username });
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new UserNotFound({ username });
      }

      throw error;
    }
  }
}

export default InMemoryUsersStore;
