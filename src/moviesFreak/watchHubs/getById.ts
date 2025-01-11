import { CouldNotGetWatchHub, WatchHubNotFound } from './errors';
import { Database } from 'database';
import { UUID } from 'types';
import { WatchHubNotFound as WatchHubDoesNotExist } from 'database/stores/errors';

export default class GetWatchHubById {
  protected database: Database;
  protected watchHubId: UUID;

  constructor(database: Database, watchHubId: UUID) {
    this.database = database;
    this.watchHubId = watchHubId;
  }

  async execute() {
    try {
      return await this.database.watchHubs.findById(this.watchHubId);
    } catch (error) {
      if (error instanceof WatchHubDoesNotExist)  {
        throw new WatchHubNotFound(error, this.watchHubId);
      }

      throw new CouldNotGetWatchHub(error)
    }
  }
}
