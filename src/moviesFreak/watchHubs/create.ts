
import { CouldNotCreateWatchHub } from './errors';
import { Database } from 'database';
import { User, WatchHub } from 'moviesFreak/entities';
import { WatchHubPrivacy } from 'moviesFreak/entities/types';

export default class CreateWatchHub {
  constructor(
    private database: Database,
    private user: User,
    private name: string,
    private privacy: WatchHubPrivacy,
    private description: string
  ) {}

  async execute() {
    const watchHub = new WatchHub({
      name: this.name,
      privacy: this.privacy,
      description: this.description
    });

    watchHub.setOwner(this.user);

    try {
      return await this.database.watchHubs.create(watchHub);
    } catch (error) {
      throw new CouldNotCreateWatchHub(error);
    }
  }
}
