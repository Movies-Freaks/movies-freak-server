import Store from './store';
import { Film } from '../../../app/moviesFreak/entities';
import { QueryOptions } from '../../../types/database';

class InMemoryFilmsStore {
  private store: Store<Film>;

  constructor() {
    this.store = new Store();
  }

  find(options: QueryOptions = {}) {
    return this.store.find(options);
  }
}

export default InMemoryFilmsStore;
