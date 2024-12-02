import DateUtils from 'jesusx21/dateUtils';

import TestCase from 'tests/src/testCase';
import usersFixture from 'tests/src/fixtures/users';

import { Session, User } from 'moviesFreak/entities';
import { SessionDoesNotBelongToUser } from 'moviesFreak/entities/errors';

export class SessionTest extends TestCase {
  private session: Session;
  private user: User;

  setUp() {
    const [userData] = usersFixture;

    this.user = new User(userData);
    this.session = Session.createForUser(this.user);
  }

  testCreateWithUser() {
    const session = Session.createForUser(this.user);

    this.assertThat(session).isInstanceOf(Session);
    this.assertThat(session.userId).isEqual(this.user.id);
    this.assertThat(session.user).isEqual(this.user);
  }

  testAddUser() {
    const session = new Session({});
    session.addUser(this.user);

    this.assertThat(session.userId).isEqual(this.user.id);
    this.assertThat(session.user).isEqual(this.user);
  }

  testThrowsErrorWhenAlreadyHaveAnotherUser() {
    const session = new Session({ userId: this.generateUUID() });

    this.assertThat(
      () => session.addUser(this.user)
    ).willThrow(SessionDoesNotBelongToUser);
  }

  testActivateToken() {
    this.assertThat(this.session.isActive).isFalse();
    this.assertThat(this.session.expiresAt).isUndefined();

    this.session.activateToken();

    this.assertThat(this.session.isActive).isTrue();
    this.assertThat(this.session.expiresAt).isEqualDate(DateUtils.getDateNYearsFromNow(1));
  }

  testDeactivateToken() {
    this.session.activateToken();
    this.assertThat(this.session.isActive).isTrue();
    this.assertThat(this.session.expiresAt).isEqualDate(DateUtils.getDateNYearsFromNow(1));

    this.session.deactivateToken();

    this.assertThat(this.session.isActive).isFalse();
    this.assertThat(this.session.expiresAt).isEqualDate(new Date());
  }

  testGenerateToken() {
    this.assertThat(this.session.token).doesNotExist();

    this.session.generateToken();

    this.assertThat(this.session.token).doesExist();
  }

  testGenerateTokenWhenPreviousTokenIsActive() {
    this.session.generateToken()
      .activateToken();

    this.assertThat(this.session.token).doesExist();
    this.assertThat(this.session.isActive).isTrue();
    this.assertThat(this.session.expiresAt).isEqualDate(DateUtils.getDateNYearsFromNow(1));

    const { token: previousToken } = this.session;

    this.session.generateToken();

    this.assertThat(this.session.token).doesExist();
    this.assertThat(this.session.token).isNotEqual(previousToken);
    this.assertThat(this.session.isActive).isFalse();
    this.assertThat(this.session.expiresAt).isEqualDate(new Date());
  }
}
