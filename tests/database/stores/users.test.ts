import SQLTestCase from '../testHelper';

import SQLDatabase from '../../../database/stores/sql';
import { User } from '../../../app/moviesFreak/entities';
import { UUID } from '../../../types/common';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import {
  EmailAlreadyExists,
  UserNotFound,
  UsernameAlreadyExists
} from '../../../database/stores/errors';

class UsersStoreTest extends SQLTestCase {
  database: SQLDatabase;
  users: User[];

  constructor() {
    super();

    this.database = this.getDatabase();
    this.users = [];
  }

  async setUp() {
    super.setUp();

    this.database = this.getDatabase();

    this.users = await this.createUsers(this.database, 5, [
      { username: 'rocky', email: 'rocky@gmail.com' },
      { username: 'columbia', email: 'columbia@gmail.com' },
      { username: 'magenta', email: 'magenta@gmail.com' }
    ]);
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class FindUserByEmailTest extends UsersStoreTest {
  async testFindByEmail() {
    const user = await this.database.users.findByEmail(this.users[1].email);

    this.assertThat(user).isInstanceOf(User);
    this.assertThat(user.username).isEqual('columbia');
    this.assertThat(user.email).isEqual('columbia@gmail.com');
  }

  async testThrowsErrorWhenUserIsNotFound() {
    await this.assertThat(
      this.database.users.findByEmail('notfound@mail.com')
    ).willBeRejectedWith(UserNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.users, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.users.findByEmail(this.users[2].email)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindUserByUsernameTest extends UsersStoreTest {
  async testFindByUsername() {
    const user = await this.database.users.findByUsername(this.users[1].username);

    this.assertThat(user).isInstanceOf(User);
    this.assertThat(user.username).isEqual('columbia');
    this.assertThat(user.email).isEqual('columbia@gmail.com');
  }

  async testThrowsErrorWhenUserIsNotFound() {
    await this.assertThat(
      this.database.users.findByUsername('notfound')
    ).willBeRejectedWith(UserNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.users, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.users.findByUsername(this.users[2].username)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
