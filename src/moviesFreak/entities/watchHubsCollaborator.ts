import Entity from './entity';
import WatchHub from './watchHub';
import { Collaboration, CollaborationType } from './types';
import { WatchHubAlreadyShared } from './errors';
import { WatchHubsCollaboratorSchema } from 'database/schemas';

export default class WatchHubsCollaborator extends Entity {
  collaborations?: Collaboration[] = [];

  readonly username: string;
  readonly name?: string;
  readonly firstLastName?: string;
  readonly secondLastName?: string;

  constructor(params: WatchHubsCollaboratorSchema) {
    super(params.id, params.createdAt, params.updatedAt);

    Object.assign(this, params);
  }

  addCollaboration(watchHub: WatchHub, type: CollaborationType) {
    if (this.hasCollaboration(watchHub)) throw new WatchHubAlreadyShared();

    this.collaborations.push({ type, watchHub });
  }

  private hasCollaboration(watchHub: WatchHub) {
    return this.collaborations.some((collaboration) => collaboration.watchHub.id === watchHub.id);
  }
}
