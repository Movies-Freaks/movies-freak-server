import AbstractMemoryStore from './abstractMemoryStore';
import { NotFound, WatchHubNotFound } from '../errors';
import { UUID } from 'types';
import { WatchHub } from 'moviesFreak/entities';

export default class MemoryWatchHubsStore extends AbstractMemoryStore<WatchHub> {
  async findById(watchHubId: UUID) {
    try {
      return await super.findById(watchHubId);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new WatchHubNotFound({ id: watchHubId });
      }

      throw error;
    }
  }
}
