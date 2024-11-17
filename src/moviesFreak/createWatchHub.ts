import { CouldNotCreateWatchHub } from './errors';
import { Database } from 'database';
import { WatchHub, WatchHubPrivacy } from 'moviesFreak/entities';

export default class CreateWatchHub {
  private database: Database;
  private name: string;
  private privacy: WatchHubPrivacy;
  private description: string;

  constructor(
    database: Database,
    name: string,
    privacy: WatchHubPrivacy,
    description: string
  ) {
    this.database = database;
    this.name = name;
    this.privacy = privacy;
    this.description = description;
  }

  async execute() {
    const watchHub = await new WatchHub({
      name: this.name,
      privacy: this.privacy,
      description: this.description
    });

    try {
      return await this.database.watchHubs.create(watchHub);
    } catch (error) {
      throw new CouldNotCreateWatchHub(error);
    }
  }
}
