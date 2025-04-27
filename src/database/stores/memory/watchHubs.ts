import { clone, isNil, set } from 'lodash';

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

  async update(watchHub: WatchHub) {
    const existentWatchHub = this.items[watchHub.id];

    if (isNil(existentWatchHub)) throw new WatchHubNotFound({ id: watchHub.id });

    existentWatchHub.name = watchHub.name;
    existentWatchHub.description = watchHub.description;
    existentWatchHub.privacy = watchHub.privacy;

    set(existentWatchHub, 'updatedAt', new Date());

    this.items[watchHub.id] = existentWatchHub;

    return clone(existentWatchHub);
  }
}
