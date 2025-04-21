import { cloneDeep, isNil } from 'lodash';

import AbstractMemoryStore from './abstractMemoryStore';
import { CollaborationAlreadyExists, WatchHubsCollaboratorNotFound } from '../errors';
import { CollaborationType } from 'moviesFreak/entities/types';
import { User, WatchHub, WatchHubsCollaborator } from 'moviesFreak/entities';
import { UUID, UUIDJson } from 'types';

export default class MemoryWatchHubsCollaboratorsStore extends AbstractMemoryStore<
WatchHubsCollaborator
> {
  protected items: UUIDJson<WatchHubsCollaborator> = {};

  async addCollaboration(collaborator: User, watchHub: WatchHub, type: CollaborationType) {
    let watchHubsCollaborator = this.items[collaborator.id]

    if (isNil(watchHubsCollaborator)) {
      watchHubsCollaborator = new WatchHubsCollaborator({
        id: collaborator.id,
        username: collaborator.username,
        name: collaborator.name,
        firstLastName: collaborator.firstLastName,
        secondLastName: collaborator.secondLastName
      });
    }

    const hasCollaboration = watchHubsCollaborator
      .collaborations
      .some((collaboration) => collaboration.watchHub.id === watchHub.id);

    if (hasCollaboration) {
      throw new CollaborationAlreadyExists(watchHub.id, collaborator.id);
    }

    watchHubsCollaborator.addCollaboration(watchHub, type);

    this.items[collaborator.id] = cloneDeep(watchHubsCollaborator);

    return watchHubsCollaborator;
  }

  async findById(id: UUID) {
    const entity = this.items[id];

    if (!entity) throw new WatchHubsCollaboratorNotFound(id);

    return cloneDeep(entity);
  }
}
