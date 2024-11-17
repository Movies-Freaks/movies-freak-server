import Entity from './entity';
import { WatchHubSchema } from 'database/schemas';

export enum WatchHubPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SHARED = 'shared'
};

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
