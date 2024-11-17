import Serializer, { field } from 'jesusx21/serializer';

import { WatchHub } from 'moviesFreak/entities';

const WatchHubSerializer = Serializer
  .init<WatchHub>(WatchHub)
  .addSchema(
    field('id'),
    field('name'),
    field('privacy'),
    field('description'),
    field('created_at', { from: 'createdAt' }),
    field('updated_at', { from: 'updatedAt' })
  );

export default WatchHubSerializer;
