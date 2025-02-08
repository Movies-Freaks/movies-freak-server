import { APIError, HTTPStatusCode } from 'jesusx21/boardGame/types';

import APITestCase from '../apiTestCase';
import constants from 'tests/src/fixtures/constants';
import { Resources } from 'tests/src/fixtures/type';

import GetWatchHubById from 'moviesFreak/watchHubs/getById';
import { UUID } from 'types';
import { WatchHubSchema } from 'database/schemas';

export class GetWatchHubByIdTest extends APITestCase {
  protected watchHubId: UUID;

  async setUp() {
    super.setUp();


    await this.loadFixture(Resources.USERS);
    await this.loadFixture(Resources.SESSIONS);
    const watchHubs = await this.loadFixture(Resources.WATCH_HUBS);
    this.watchHubId = watchHubs[1].id;
  }

  async testGetWatchHubByItsId() {
    const result = await this.simulateGet<WatchHubSchema>({
      path: `/watchHubs/${this.watchHubId}`,
      token: constants.TOKEN_3
    });

    this.assertThat(result.id).isEqual(this.watchHubId);
    this.assertThat(result.privacy).isEqual('shared');
    this.assertThat(result.name).isEqual('A Very Christmas List');
  }

  async testReturnErrorWhenAuthenticationTokenIsNotSent() {
    const result = await this.simulateGet<APIError>({
      path: `/watchHubs/${this.watchHubId}`,
      statusCode: 401
    });

    this.assertThat(result.code).isEqual('UNAUTHORIZED');
  }

  async testReturnErrorWhenUserIsNotAuthenticated() {
    const result = await this.simulateGet<APIError>({
      path: `/watchHubs/${this.watchHubId}`,
      statusCode: 401,
      token: constants.TOKEN_4
    });

    this.assertThat(result.code).isEqual('TOKEN_EXPIRED');
  }

  async testReturnErrorWhenWatchHubIsNotFound() {
    const result = await this.simulateGet<APIError>({
      path: `/watchHubs/${this.generateUUID()}`,
      statusCode: HTTPStatusCode.NOT_FOUND,
      token: constants.TOKEN_3
    });

    this.assertThat(result.code).isEqual('WATCH_HUB_NOT_FOUND');
  }

  async testReturnsErrorOnUnexpectedError() {
    this.mockClass(GetWatchHubById, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulateGet<APIError>({
      path: `/watchHubs/${this.watchHubId}`,
      statusCode: HTTPStatusCode.UNEXPECTED_ERROR,
      token: constants.TOKEN_3
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
