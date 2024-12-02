import DateUtils from 'jesusx21/dateUtils';

import Constants from 'tests/src/fixtures/constants';
import SQLTestCase from '../testCase';
import { Resources } from 'tests/src/fixtures/type';

import { Session, User } from 'moviesFreak/entities';
import { SessionNotFound, TokenAlreadyUsed, UserNotFound } from 'database/stores/errors';
import { SQLDatabaseException } from 'database/stores/sql/errors';
import { UUID } from 'types';

class SessionsStoreTest extends SQLTestCase {
  protected sessions: Session[];

  async setUp() {
    super.setUp();

      await this.loadFixture(Resources.USERS);
      this.sessions = await this.loadFixture<Session>(Resources.SESSIONS);
  }
}

export class CreateSessionTest extends SessionsStoreTest {
  protected sessionToCreate: Session;

  async setUp() {
    await super.setUp();

    this.sessionToCreate = this.buildSession();
  }

  async testCreateUser() {
    const sessionCreated = await this.database
      .sessions
      .create(this.sessionToCreate);

    this.assertThat(sessionCreated).isInstanceOf(Session);
    this.assertThat(sessionCreated.id).doesExist();
    this.assertThat(sessionCreated.userId).isEqual('fb720643-1d12-4fca-8d2f-61a18d842d2c');
    this.assertThat(sessionCreated.token).isEqual('62da8cc921eb3f81fd9979039b16bbca');
    this.assertThat(sessionCreated.isActive).isFalse();
    this.assertThat(sessionCreated.createdAt).isEqualDate(new Date());
  }

  async testThrowErrorWhenTokenIsAlreadyUsed() {
    await this.database.sessions.create(this.sessionToCreate);

    await this.assertThat(
      this.database.sessions.create(this.sessionToCreate)
    ).willBeRejectedWith(TokenAlreadyUsed);
  }

  async testThrowErrorWhenUserDoesNotExist() {
    const session = Session
      .createForUser({ id: this.generateUUID() } as User)
      .generateToken()
      .activateToken();

    await this.assertThat(
      this.database.sessions.create(session)
    ).willBeRejectedWith(UserNotFound);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this.database.sessions, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.sessions.create(this.sessionToCreate)
    ).willBeRejectedWith(SQLDatabaseException);
  }

  private buildSession() {
    return new Session({
      userId: Constants.USER_3,
      token: '62da8cc921eb3f81fd9979039b16bbca',
      expiresAt: DateUtils.getDateNDaysFromNow(2),
      isActive: false
    });
  }
}

export class FindByIdTest extends SessionsStoreTest {
  protected sessionId: UUID;

  async setUp() {
    await super.setUp();

    this.sessionId = this.sessions[1].id;
  }

  async testFindSessionById() {
    const sessionFound = await this.database
      .sessions
      .findById(this.sessionId);

    this.assertThat(sessionFound.userId).isEqual('e42d57e4-ddb0-4a63-9d88-b452f4979abe');
    this.assertThat(sessionFound.token).isEqual('9c7ae8b07eeb4d7bce7afb37444ed0ea');
    this.assertThat(sessionFound.isActive).isFalse();
  }

  async testThrowsErrorWhenSessionIsNotFound() {
    await this.assertThat(
      this.database
        .sessions
        .findById(this.generateUUID())
    ).willBeRejectedWith(SessionNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.sessions, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database
        .sessions
        .findById(this.sessionId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
