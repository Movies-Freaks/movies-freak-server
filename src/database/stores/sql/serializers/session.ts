import Serializer, { field } from 'jesusx21/serializer';

import { Session } from 'moviesFreak/entities';

const SessionSerializer = Serializer
  .init<Session>(Session)
  .addSchema(
    field('id'),
    field('token'),
    field('expires_at', { from: 'expiresAt' }),
    field('is_active', { from: 'isActive' }),
    field('user_id', { from: 'userId' }),
    field('created_at', { from: 'createdAt' }),
    field('updated_at', { from: 'updatedAt' })
  );

export default SessionSerializer;
