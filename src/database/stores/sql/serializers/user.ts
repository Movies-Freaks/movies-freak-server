import Serializer, { field } from 'jesusx21/serializer';

import { User } from 'moviesFreak/entities';

const UserSerializer = Serializer
  .init<User>(User)
  .addSchema(
    field('id'),
    field('birthdate'),
    field('email'),
    field('name'),
    field('username'),
    field('first_last_name', { from: 'firstLastName' }),
    field('second_last_name', { from: 'secondLastName' }),
    field('created_at', { from: 'createdAt' }),
    field('updated_at', { from: 'updatedAt' })
  );

export default UserSerializer;
