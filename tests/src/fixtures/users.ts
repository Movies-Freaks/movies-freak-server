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
      hash: '86c53f1ac46d2afd08565dfd49a7076bb2825b3baf617a00678a7f44025100428835cf6c03bb03ee0eaacd1292af84c4e082b7d1c4b6c794f20eda8f14fdd8fb',
      salt: '3881b23824b8ba41'
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
      hash: '8c7925b82c1e58fbcb4f4fe0b111511e6e9c9997655c0e55417217d64600bbae00eab0423919e64f9915e0470b069cffaa14d4c468dd5d9444806c1cd87efab0',
      salt: '5db9b8c762881794'
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
      hash: '9bc453430dbb28f681202d52db72a65c0e4c595aa8429716591e9da5d691ad9c865815a37ba3b7301540e222295daebfb250e1bf511aec741c1bbcdfea7e85f1',
      salt: '48e110900aba1603'
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
      hash: '276924f56850c2ba2726e0ac7ba87f8e5002050228e8e63dcb0af7af9c4bdfb957e1cec7713efbe15707fc7263609263b1f54e566fa4e9dbf8b41e4a83780a4d',
      salt: 'fa2c53d157076cab'
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
      hash: '9cbf2780b18fd357c7a4a330d65f7519b690b11f7e03690b7f2a58f0ca2046896cd28007b04c4433191fecd087d5b1e01eaa6d8a0f3c0d9045268021c690a8f9',
      salt: 'bb82afb326eab930'
    }
  }
];

export default usersFixture;
