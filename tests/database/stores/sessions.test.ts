import SQLTestCase from '../testHelper';

import { Json, UUID } from '../../../types/common';
import { Session, User } from '../../../app/moviesFreak/entities';
import { SessionNotFound } from '../../../database/stores/errors';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';

class SessionsStoreTest extends SQLTestCase {
  user?: User;
  sessions: Session[];

  constructor() {
    super();

    this.sessions = [];
  }

  async setUp() {
    super.setUp();

    this.database = this.getDatabase();
    this.user = await this.createUser(this.getDatabase(), { username: 'jesusx21' });
    this.sessions = await this.createSessions(this.user, { quantity: 5 });
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }

  protected async createSessions(user: User, options?: Json) {
    const { quantity = 1 } = options || {};

    const fixtures = await this.generateFixtures({
      quantity,
      type: 'session'
    });

    return Promise.all(
      fixtures.map((data: any) => {
        const session = new Session({ ...data, isActive: false, user });
        return this.getDatabase()
          .sessions
          .create(session);
      })
    );
  }

  protected async getUser() {
    if (!this.user) {
      this.user = await this.createUser(this.getDatabase(), { username: 'jesusx21' });
    }

    return this.user;
  }
}

export class FindActiveSessionByUserIdTest extends SessionsStoreTest {
  userId: UUID;

  constructor() {
    super();

    this.userId = this.generateUUID();
  }

  async setUp() {
    await super.setUp();

    this.userId = this.user?.id || this.generateUUID();
  }

  async testFindActiveByUserId() {
    const user = await this.getUser();
    const sessionActived = await this.createSession(this.getDatabase(), user);

    await this.createSessions(user, { quantity: 5 });

    const sessionFound = await this.getDatabase()
      .sessions
      .findActiveByUserId(this.userId);

    this.assertThat(sessionFound).isInstanceOf(Session);
    this.assertThat(sessionFound.id).isEqual(sessionActived.id);
    this.assertThat(sessionFound.isActive()).isTrue();
  }

  async testThrowsErrorWhenUserHasNotActriveSessions() {
    await this.assertThat(
      this.getDatabase()
        .sessions
        .findActiveByUserId(this.userId)
    ).willBeRejectedWith(SessionNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.getDatabase().sessions, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.getDatabase()
        .sessions
        .findActiveByUserId(this.userId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class UpdateSessionTest extends SessionsStoreTest {
  async testUpdateTokenGenerated() {
    const session = this.sessions[1];
    const token = session.token;

    session.generateToken();

    const sessionUpdated = await this.getDatabase()
      .sessions
      .update(session);

    this.assertThat(sessionUpdated.id).isEqual(session.id);
    this.assertThat(sessionUpdated.token).isNotEqual(token);
    this.assertThat(sessionUpdated.expiresAt).doesNotExist();
    this.assertThat(sessionUpdated.isActive()).isFalse();
  }

  async testUpdateTokenActivation() {
    const session = this.sessions[1];
    const token = session.token;

    session.generateToken()
      .activateToken();

    const sessionUpdated = await this.getDatabase()
      .sessions
      .update(session);

    this.assertThat(sessionUpdated.token).isNotEqual(token);
    this.assertThat(sessionUpdated.expiresAt).doesExist();
    this.assertThat(sessionUpdated.isActive()).isTrue();
  }

  async testNotUpdateNotEditableFields() {
    const session = this.sessions[1];

    Object.assign(session, { _createdAt: new Date() });

    const sessionUpdated = await this.getDatabase()
      .sessions
      .update(session);

    this.assertThat(sessionUpdated.createdAt).isNotEqual(session.createdAt);
  }

  async testThrowNotFoundWhenSessionDoesNotExist() {
    const session = this.sessions[1];

    Object.assign(session, { _id: this.generateUUID() });

    this.assertThat(
      this.getDatabase()
        .sessions
        .update(session)
    ).willBeRejectedWith(SessionNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.getDatabase().sessions, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.getDatabase()
        .sessions
        .update(this.sessions[1])
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
