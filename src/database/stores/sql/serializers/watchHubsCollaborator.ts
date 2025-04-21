import Serializer, { field } from 'jesusx21/serializer';

import { WatchHubsCollaborator } from 'moviesFreak/entities';

const WatchHubsCollaboratorSerializer = Serializer
  .init<WatchHubsCollaborator>(WatchHubsCollaborator)
  .addSchema(
    field('id'),
    field('name'),
    field('username'),
    field('first_last_name', { from: 'firstLastName' }),
    field('second_last_name', { from: 'secondLastName' }),
    field('created_at', { from: 'createdAt' }),
    field('updated_at', { from: 'updatedAt' })
  );

export default WatchHubsCollaboratorSerializer;
