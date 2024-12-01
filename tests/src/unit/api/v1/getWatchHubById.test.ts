import { APIError, HTTPStatusCode } from 'jesusx21/boardGame/types';

import APITestCase from '../apiTestCase';
import { Resources } from 'tests/src/fixtures/type';

import GetWatchHubById from 'moviesFreak/watchHubs/getById';
import { UUID } from 'types';
import { WatchHubSchema } from 'database/schemas';

export class GetWatchHubByIdTest extends APITestCase {
  protected watchHubId: UUID;

  async setUp() {
    super.setUp();

    const { watchHubs } = await this.loadFixtures(this.database, Resources.WATCH_HUBS);
    this.watchHubId = watchHubs[1].id;
  }

  async testGetWatchHubByItsId() {
    const result = await this.simulateGet<WatchHubSchema>({
      path: `/watchHubs/${this.watchHubId}`
    });

    this.assertThat(result.id).isEqual(this.watchHubId);
    this.assertThat(result.privacy).isEqual('shared');
    this.assertThat(result.name).isEqual('A Very Christmas List');
  }

  async testReturnErrorWhenWatchHubIsNotFound() {
    const result = await this.simulateGet<APIError>({
      path: `/watchHubs/${this.generateUUID()}`,
      statusCode: HTTPStatusCode.NOT_FOUND
    });

    this.assertThat(result.code).isEqual('WATCH_HUB_NOT_FOUND');
  }

  async testReturnsErrorOnUnexpectedError() {
    this.mockClass(GetWatchHubById, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulateGet<APIError>({
      path: `/watchHubs/${this.watchHubId}`,
      statusCode: HTTPStatusCode.UNEXPECTED_ERROR
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
