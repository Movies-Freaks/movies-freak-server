import { WatchHubPrivacy, WatchHubSchema } from 'database/schemas';
import Entity from './entity';

export default class WatchHub extends Entity {
  name: string;
  privacy: WatchHubPrivacy;
  description: string;
  totalMovies?: number;

  constructor(params: WatchHubSchema) {
    super(params.id, params.createdAt, params.updatedAt);

    Object.assign(this, params);
  }
}
