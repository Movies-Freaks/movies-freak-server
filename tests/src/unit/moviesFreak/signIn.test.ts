import TestCase from 'tests/src/testCase';
import { Resources } from 'tests/src/fixtures/type';

import SignIn from 'moviesFreak/signIn';
import { CouldNotSignIn, PasswordDoesntMatch, UserNotFound } from 'moviesFreak/errors';
import { DatabaseError } from 'database/errors';
import { Session, User } from 'moviesFreak/entities';

export class SignInTest extends TestCase {
  signIn: SignIn;

  async setUp() {
    super.setUp();

    this.database = this.getDatabase();

    await this.loadFixture(Resources.USERS);

    this.signIn = new SignIn(this.database, 'albus', 'fakePasswordSalt');
  }

  async tearDown() {
    super.tearDown();

    this.removeDatabase();
  }

  async testCreatesNewSessionWithEmail() {
    this.signIn = new SignIn(this.database, 'potter.weasley@hogwarts.wiz', 'fakePasswordSalt');

    const session = await this.signIn.execute();

    this.assertThat(session).isInstanceOf(Session);
    this.assertThat(session.expiresAt).isGreaterThan(session.createdAt);
    this.assertThat(session.isActive).isTrue();
    this.assertThat(session.user).isInstanceOf(User);
    this.assertThat(session.user.username).isEqual('albus');
  }

  async testCreatesNewSessionWithUsername() {
    const session = await this.signIn.execute();

    this.assertThat(session).isInstanceOf(Session);
    this.assertThat(session.expiresAt).isGreaterThan(session.createdAt);
    this.assertThat(session.isActive).isTrue();
    this.assertThat(session.user).isInstanceOf(User);
    this.assertThat(session.user.username).isEqual('albus');
  }

  async testDeactiveLatestActiveSession() {
    const session = await this.signIn.execute();
    const newSession = await this.signIn.execute();

    const previousSession = await this.database.sessions.findById(session.id);

    this.assertThat(previousSession.id).isNotEqual(newSession.id);
    this.assertThat(previousSession.expiresAt).isLessThanOrEqual(newSession.createdAt);
    this.assertThat(previousSession.isActive).isFalse();
  }

  async testThrowErrorWhenGettingUserByEmailFails() {
    this.signIn = new SignIn(this.database, 'albus@gmail.com', 'fakePasswordSalt');

    this.stubFunction(this.database.users, 'findByEmail')
      .rejects(new DatabaseError());

    await this.assertThat(
      this.signIn.execute()
    ).willBeRejectedWith(CouldNotSignIn);
  }

  async testThrowErrorWhenGettingUserByUsernameFails() {
    this.stubFunction(this.database.users, 'findByUsername')
      .rejects(new DatabaseError());

    await this.assertThat(
      this.signIn.execute()
    ).willBeRejectedWith(CouldNotSignIn);
  }

  async testThrowErrorWhenUserDoesNotExist() {
    this.signIn = new SignIn(this.database, 'noone@gmail.com', 'fakePasswordSalt');

    await this.assertThat(
      this.signIn.execute()
    ).willBeRejectedWith(UserNotFound);
  }

  async testThrowErrorWhenPasswordDoesNotMatch() {
    this.signIn = new SignIn(this.database, 'albus', 'invalidPassword');

    await this.assertThat(
      this.signIn.execute()
    ).willBeRejectedWith(PasswordDoesntMatch);
  }

  async testThrowErrorWhenFindingLatestSessionFails() {
    this.stubFunction(this.database.sessions, 'findLatestActiveByUserId')
      .rejects(new DatabaseError());

    await this.assertThat(
      this.signIn.execute()
    ).willBeRejectedWith(CouldNotSignIn);
  }

  async testThrowErrorWhenDeactivatingLatestSessionFails() {
    await this.signIn.execute();

    this.stubFunction(this.database.sessions, 'update')
      .rejects(new DatabaseError());

    await this.assertThat(
      this.signIn.execute()
    ).willBeRejectedWith(CouldNotSignIn);
  }

  async testThrowErrorWhenCreateNewSessionFails() {
    this.stubFunction(this.database.sessions, 'create')
      .rejects(new DatabaseError());

    await this.assertThat(
      this.signIn.execute()
    ).willBeRejectedWith(CouldNotSignIn);
  }
}
