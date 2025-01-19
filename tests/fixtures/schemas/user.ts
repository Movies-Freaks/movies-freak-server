import {
  DATETIME,
  EMAIL,
  JSON,
  STRING,
  UUID
} from './types';

const user = JSON(
  {
    id: UUID,
    birthdate: DATETIME,
    email: EMAIL,
    firstLastName: STRING({ min: 5, max: 20 }),
    name: STRING({ min: 5, max: 60 }),
    secondLastName: STRING({ min: 5, max: 20 }),
    username: STRING({ min: 3, max: 15 }),
    createdAt: DATETIME,
    updatedAt: DATETIME
  },
  ['id', 'name', 'firstLastName', 'username', 'email']
);

export default user;
