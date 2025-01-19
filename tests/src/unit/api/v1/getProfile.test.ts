import { APIError, HTTPStatusCode } from 'jesusx21/boardGame/types';

import APITestCase from '../apiTestCase';
import { Resources } from 'tests/src/fixtures/type';

import ProfileResource from 'api/v1/resources/profile';
import * as authenticate from 'api/v1/middlewares/authenticate';
import { UserSchema } from 'database/schemas';
import { Session, User } from 'moviesFreak/entities';

export class GetProfileTest extends APITestCase {
  protected session: Session;

  async setUp() {
    super.setUp();
    this.createSandbox();

    const sessions = await this.loadFixture<Session>(Resources.SESSIONS);
    await this.loadFixture<User>(Resources.USERS);

    this.session = sessions[2];
  }

  tearDown(): void {
    this.removeDatabase();
    this.restoreSandbox();
  }

  async testGetProfile() {
    const result = await this.simulateGet<UserSchema>({
      path: '/profile',
      token: this.session.token
    });

    this.assertThat(result.id).isEqual(this.session.userId);
    this.assertThat(result.name).isEqual('Cedric');
    this.assertThat(result.username).isEqual('cedric');
    this.assertThat(result.firstLastName).isEqual('Diggory');
    this.assertThat(result.email).isEqual('diggory@hogwarts.wiz');
  }

  async testReturnErrorWhenTokenIsNotSent() {
    const result = await this.simulateGet<APIError>({
      path: '/profile',
      statusCode: HTTPStatusCode.UNAUTHORIZED
    });

    this.assertThat(result.code).isEqual('UNAUTHORIZED');
  }

  async testReturnsErrorOnUnexpectedError() {
    this.stubFunction(authenticate, 'default')
      .resolves();

    this.mockClass(ProfileResource, 'instance')
      .expects('getTitle')
      .returns(new Error('database fails'));

    const result = await this.simulateGet<APIError>({
      path: '/profile',
      statusCode: HTTPStatusCode.UNEXPECTED_ERROR,
      token: this.session.token
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
