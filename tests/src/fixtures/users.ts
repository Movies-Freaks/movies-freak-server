import Constants from './constants';

const usersFixture = [
  {
    id: Constants.USER_1,
    name: 'Hermione',
    username: 'smart_witch',
    firstLastName: 'Granger',
    email: 'granger@hogwarts.wiz',
    birthdate: new Date(1979, 8, 19),
    password: {
      salt: 'fakePasswordSalt',
      hash: 'fakePasswordHash'
    }
  },
  {
    id: Constants.USER_2,
    name: 'Albus Severus',
    username: 'albus',
    firstLastName: 'Potter',
    secondLastName: 'Weasley',
    email: 'potter.weasley@hogwarts.wiz',
    birthdate: new Date(2005, 8, 1),
    password: {
      salt: 'fakePasswordSalt',
      hash: 'fakePasswordHash'
    }
  },
  {
    id: Constants.USER_3,
    name: 'Cedric',
    username: 'cedric',
    firstLastName: 'Diggory',
    email: 'diggory@hogwarts.wiz',
    birthdate: new Date(1977, 9, 31),
    password: {
      salt: 'fakePasswordSalt',
      hash: 'fakePasswordHash'
    }
  },
  {
    id: Constants.USER_4,
    name: 'Newton Artemis',
    username: 'newt',
    firstLastName: 'Fido',
    secondLastName: 'Scamander',
    email: 'scamander@hogwarts.wiz',
    birthdate: new Date(1897, 1, 24),
    password: {
      salt: 'fakePasswordSalt',
      hash: 'fakePasswordHash'
    }
  },
  {
    id: Constants.USER_5,
    name: 'Narcisa',
    username: 'narcisa',
    firstLastName: 'Black',
    secondLastName: 'Malfoy',
    email: 'black@hogwarts.wiz',
    birthdate: new Date(1955, 3, 25),
    password: {
      salt: 'fakePasswordSalt',
      hash: 'fakePasswordHash'
    }
  }
];

export default usersFixture;
