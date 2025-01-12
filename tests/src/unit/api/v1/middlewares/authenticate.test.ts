import { HTTPInternalError, HTTPUnauthorized, Monopoly } from 'jesusx21/boardGame';
import { Request } from 'jesusx21/boardGame/types';

import { Resources } from 'tests/src/fixtures/type';
import APITestCase from '../../apiTestCase';

import authenticate from 'api/v1/middlewares/authenticate';
import Constants from 'tests/src/fixtures/constants';
import { DatabaseError } from 'database/errors';

class FakeResource extends Monopoly {}

export class AuthenticateTest extends APITestCase {
  protected request: Request;
  protected resource: FakeResource;

  async setUp() {
    this.database = this.getDatabase();
    this.resource = new FakeResource();

    await this.loadFixture(Resources.USERS, this.database);
    await this.loadFixture(Resources.SESSIONS, this.database);

    this.createSandbox();
    this.resource.setTitle('database', this.database);

    this.request = {
      headers: {
        authorization: `Bearer ${Constants.TOKEN_3}`
      }
    } as any as Request;
  }

  async tearDown() {
    super.setUp();

    this.removeDatabase();
    this.restoreSandbox();
  }

  async testAuthenticateToken() {
    this.spyFunction(this.resource, 'setTitle');

    await authenticate(this.request, this.resource);

    // TODO: allow behave on  Classpuccino.TestHelper
    // TODO: validate spied
  }

  async testReturnsErorrWhenTokenIsMissing() {
    this.request.headers = {};

    const error = await this.assertThat(
      authenticate(this.request, this.resource)
    ).willBeRejectedWith<HTTPUnauthorized>(HTTPUnauthorized);

    this.assertThat(error.payload.code).isEqual('UNAUTHORIZED');
  }

  async testReturnsErorrWhenTokenNotBearer() {
    this.request.headers.authorization = Constants.TOKEN_3;

    const error = await this.assertThat(
      authenticate(this.request, this.resource)
    ).willBeRejectedWith<HTTPUnauthorized>(HTTPUnauthorized);

    this.assertThat(error.payload.code).isEqual('EXPECTED_BEARER_TOKEN');
  }

  async testReturnsErorrWhenTokenDoesNotExist() {
    this.request.headers.authorization = 'Bearer InvalidToken';

    await this.assertThat(
      authenticate(this.request, this.resource)
    ).willBeRejectedWith(HTTPUnauthorized);
  }

  async testReturnsErorrWhenDatabaseFails() {
    this.stubFunction(this.database.sessions, 'findActiveSessionByToken')
      .rejects(new DatabaseError());

    await this.assertThat(
      authenticate(this.request, this.resource)
    ).willBeRejectedWith(HTTPInternalError);
  }
}
