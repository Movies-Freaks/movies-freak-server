import Entity from './entity';
import { WatchHubSchema } from 'database/schemas';
import User from './user';
import { UUID } from 'types';

export enum WatchHubPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SHARED = 'shared'
};

export default class WatchHub extends Entity {
  name: string;
  description: string;
  privacy: WatchHubPrivacy;
  owner: User;
  ownerId: UUID;
  totalMovies?: number;

  constructor(params: WatchHubSchema) {
    super(params.id, params.createdAt, params.updatedAt);

    Object.assign(this, params);
  }

  setOwner(owner: User) {
    this.owner = owner;
    this.ownerId = owner.id;
  }
}
