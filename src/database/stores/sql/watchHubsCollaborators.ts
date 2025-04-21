import { isEmpty } from 'lodash';
import { Knex } from 'knex';

import { Collaboration, CollaborationType } from 'moviesFreak/entities/types';
import { CollaborationAlreadyExists, WatchHubsCollaboratorNotFound } from '../errors';
import { Json, UUID } from 'types';
import { SQLDatabaseException } from './errors';
import { SQLTables } from './tables';
import { User, WatchHub, WatchHubsCollaborator } from 'moviesFreak/entities';
import { WatchHubsCollaboratorSerializer, WatchHubSerializer } from './serializers';


type SQLCollaborator = {
  id: UUID,
  username: string,
  name: string,
  first_last_name: string,
  second_last_name: string,
  watch_hubs: Json[]
};

export default class SQLWatchHubsCollaboratorsStore {
  protected connection: Knex;

  constructor(connection: Knex) {
    this.connection = connection;
  }

  async create(watchHubsCollaborator: WatchHubsCollaborator) {
    await Promise.all(
      watchHubsCollaborator.collaborations.map(async (collaboration: Collaboration) => {
        try {
          await this.connection(SQLTables.WATCH_HUBS_COLLABORATORS)
            .insert(({
              collaborator_id: watchHubsCollaborator.id,
              type: collaboration.type,
              watch_hub_id: collaboration.watchHub.id,
            }));
        } catch (error) {
          throw new SQLDatabaseException(error);
        }
      })
    );

    return this.findById(watchHubsCollaborator.id);
  }

  async addCollaboration(collaborator: User, watchHub: WatchHub, type: CollaborationType) {
    try {
      await this.connection(SQLTables.WATCH_HUBS_COLLABORATORS)
        .insert(({
          type,
          collaborator_id: collaborator.id,
          watch_hub_id: watchHub.id
        }));
    } catch (error) {
      if (error.code === '23505') {
        throw new CollaborationAlreadyExists(watchHub.id, collaborator.id);
      }

      throw new SQLDatabaseException(error);
    }

    return this.findById(collaborator.id);
  }

  async findById(id: UUID) {
    let result: Json;

    try {
      result = await this.connection(SQLTables.WATCH_HUBS_COLLABORATORS)
        .select(
          `${SQLTables.WATCH_HUBS_COLLABORATORS}.collaborator_id AS id`,
          `${SQLTables.USERS}.username`,
          `${SQLTables.USERS}.name`,
          `${SQLTables.USERS}.first_last_name`,
          `${SQLTables.USERS}.second_last_name`,
          `${SQLTables.WATCH_HUBS}.id AS watch_hub_id`,
          `${SQLTables.WATCH_HUBS}.name AS watch_hub_name`,
          `${SQLTables.WATCH_HUBS}.description AS watch_hub_description`,
          `${SQLTables.WATCH_HUBS_COLLABORATORS}.type as collaboration_type`,
          `${SQLTables.WATCH_HUBS}.owner_id AS watch_hub_owner_id`,
          `${SQLTables.WATCH_HUBS}.privacy AS watch_hub_privacy`
        )
        .innerJoin(
          SQLTables.USERS,
          `${SQLTables.WATCH_HUBS_COLLABORATORS}.collaborator_id`,
          `${SQLTables.USERS}.id`
        )
        .innerJoin(
          SQLTables.WATCH_HUBS,
          `${SQLTables.WATCH_HUBS_COLLABORATORS}.watch_hub_id`,
          `${SQLTables.WATCH_HUBS}.id`
        )
        .where(`${SQLTables.WATCH_HUBS_COLLABORATORS}.collaborator_id`, id);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (isEmpty(result)) throw new WatchHubsCollaboratorNotFound(id);

    const collaborator: SQLCollaborator = {
      id: result[0].id,
      username: result[0].username,
      name: result[0].name,
      first_last_name: result[0].first_last_name,
      second_last_name: result[0].second_last_name,
      watch_hubs: []
    }

    collaborator.watch_hubs = result.map((item: Json) => {
      return {
        id: item.watch_hub_id,
        name: item.watch_hub_name,
        description: item.watch_hub_description,
        collaboration_type: item.collaboration_type,
        owner_id: item.watch_hub_owner_id,
        privacy: item.watch_hub_privacy
      };
    });

    return this.deserialize(collaborator);
  }

  protected deserialize(data: Json) {
    const watchHubsCollaborator = WatchHubsCollaboratorSerializer.fromJson(data);

    data
      .watch_hubs
      .forEach((watchHubData: Json) => {
        const watchHub = WatchHubSerializer.fromJson(watchHubData);
        watchHubsCollaborator.addCollaboration(watchHub, watchHubData.collaboration_type);
      });

    return watchHubsCollaborator;
  }
}
