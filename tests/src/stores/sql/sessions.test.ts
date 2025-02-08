import DateUtils from 'jesusx21/dateUtils';
import { set } from 'lodash';

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

export class FindSessionByTokenTest extends SessionsStoreTest {
  protected token: string;

  async setUp() {
    await super.setUp();

    this.token = Constants.TOKEN_5;
  }

  async testFindSessionByToken() {
    const sessionFound = await this.database
      .sessions
      .findByToken(this.token);

    this.assertThat(sessionFound.token).isEqual('0e127cd7f6e5ae88983265807bb3994a');
    this.assertThat(sessionFound.isActive).isTrue();
  }

  async testThrowsErrorWhenSessionIsNotFound() {
    await this.assertThat(
      this.database
        .sessions
        .findByToken('InvalidToken')
    ).willBeRejectedWith(SessionNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.sessions, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database
        .sessions
        .findByToken(this.token)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindLatestActiveByUserIdTest extends SessionsStoreTest {
  async testFindLatestActiveSessionByUserId() {
    const sessionFound = await this.database
      .sessions
      .findLatestActiveByUserId(Constants.USER_1);

    this.assertThat(sessionFound.userId).isEqual('3e4252d5-fdca-4e00-906a-70407982699d');
    this.assertThat(sessionFound.isActive).isTrue();
  }

  async testThrowsErrorWhenUserHasNotActiveSessions() {
    const session = await this.database
      .sessions
      .findLatestActiveByUserId(Constants.USER_1);

    session.deactivateToken();
    await this.database.sessions.update(session);

    await this.assertThat(
      this.database
        .sessions
        .findLatestActiveByUserId(Constants.USER_1)
    ).willBeRejectedWith(SessionNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.sessions, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database
        .sessions
        .findLatestActiveByUserId(Constants.USER_1)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class UpdateSessionTest extends SessionsStoreTest {
  private session: Session;
  private token: string;

  async setUp(): Promise<void> {
    await super.setUp();

    this.session = this.sessions[1]
    this.token = this.session.token;
  }

  async testUpdateToken() {
    this.session.generateToken();

    const sessionUpdated = await this.database
      .sessions
      .update(this.session);

    this.assertThat(sessionUpdated.id).isEqual(this.session.id);
    this.assertThat(sessionUpdated.token).isNotEqual(this.token);
    this.assertThat(sessionUpdated.isActive).isFalse();
  }

  async testUpdateTokenActivation() {
    this.session.generateToken()
      .activateToken();

    const sessionUpdated = await this.getDatabase()
      .sessions
      .update(this.session);

    this.assertThat(sessionUpdated.token).isNotEqual(this.token);
    this.assertThat(sessionUpdated.expiresAt).doesExist();
    this.assertThat(sessionUpdated.isActive).isTrue();
  }

  async testIgnoresNotEditableFields() {
    set(this.session, 'createdAt',  new Date());

    const sessionUpdated = await this.getDatabase()
      .sessions
      .update(this.session);

    this.assertThat(sessionUpdated.createdAt).isNotEqual(this.session.createdAt);
  }

  async testThrowNotFoundWhenSessionDoesNotExist() {
    set(this.session, 'id',  this.generateUUID());

    this.assertThat(
      this.getDatabase()
        .sessions
        .update(this.session)
    ).willBeRejectedWith(SessionNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.sessions, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.getDatabase()
        .sessions
        .update(this.session)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
