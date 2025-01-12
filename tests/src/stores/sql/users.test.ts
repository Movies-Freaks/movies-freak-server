import Serializer, { SerializerError } from 'jesusx21/serializer';

import SQLTestCase from '../testCase';
import { Resources } from 'tests/src/fixtures/type';

import { EmailAlreadyExists, UsernameAlreadyExists, UserNotFound } from 'database/stores/errors';
import { SQLDatabaseException } from 'database/stores/sql/errors';
import { User } from 'moviesFreak/entities';
import { UUID } from 'types';

class UsersStoreTest extends SQLTestCase {
  protected users: User[];

  async setUp() {
    super.setUp();

    this.users = await this.loadFixture<User>(Resources.USERS);
  }
}

export class CreateUserTest extends UsersStoreTest {
  protected userToCreate: User;

  async setUp(){
    await super.setUp();

    this.userToCreate = this.buildUser();
  }

  async testCreateUser() {
    const userCreated = await this.database
      .users
      .create(this.userToCreate);

    this.assertThat(userCreated).isInstanceOf(User);
    this.assertThat(userCreated.id).doesExist();
    this.assertThat(userCreated.name).isEqual('Remus John');
    this.assertThat(userCreated.username).isEqual('wolf');
    this.assertThat(userCreated.firstLastName).isEqual('Lupin');
    this.assertThat(userCreated.createdAt).isEqualDate(new Date());
  }

  async testThrowErrorWhenUsernameIsAlreadyUsed() {
    await this.database.users.create(this.userToCreate);

    this.userToCreate.email = 'john@gmail.com';

    await this.assertThat(
      this.database.users.create(this.userToCreate)
    ).willBeRejectedWith(UsernameAlreadyExists);
  }

  async testThrowErrorWhenEmailIsAlreadyUsed() {
    await this.database.users.create(this.userToCreate);

    this.userToCreate.username = 'johnny';

    await this.assertThat(
      this.database.users.create(this.userToCreate)
    ).willBeRejectedWith(EmailAlreadyExists);
  }

  async testThrowErrorOnSerializationError() {
    this.mockClass(Serializer<User>)
      .expects('fromJson')
      .throws(new SerializerError());

    await this.assertThat(
      this.database
        .users
        .create(this.userToCreate)
    ).willBeRejectedWith(SerializerError);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this.database.users, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.users.create(this.userToCreate)
    ).willBeRejectedWith(SQLDatabaseException);
  }

  private buildUser() {
    return new User({
      name: 'Remus John',
      username: 'wolf',
      firstLastName: 'Lupin',
      email: 'lupin@hogwarts.wiz',
      birthdate: new Date(1960, 2, 10),
      password: {
        salt: 'fakePasswordSalt',
        hash: 'fakePasswordHash'
      }
    });
  }
}

export class FindByIdTest extends UsersStoreTest {
  protected userId: UUID;

  async setUp() {
    await super.setUp();

    this.userId = this.users[1].id;
  }

  async testFindUserById() {
    const userFound = await this.database
      .users
      .findById(this.userId);

    this.assertThat(userFound).isInstanceOf(User);
    this.assertThat(userFound.id).doesExist();
    this.assertThat(userFound.name).isEqual('Albus Severus');
    this.assertThat(userFound.username).isEqual('albus');
    this.assertThat(userFound.firstLastName).isEqual('Potter');
  }

  async testThrowsErrorWhenUserIsNotFound() {
    await this.assertThat(
      this.database
        .users
        .findById(this.generateUUID())
    ).willBeRejectedWith(UserNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.users, 'connection')
      .throws(new SerializerError());

    await this.assertThat(
      this.database
        .users
        .findById(this.userId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
