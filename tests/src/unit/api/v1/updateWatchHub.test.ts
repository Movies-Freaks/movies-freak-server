import { APIError } from 'jesusx21/boardGame/types';
import { UUID } from 'jesusx21/uuid';

import APITestCase from '../apiTestCase';
import constants from 'tests/src/fixtures/constants';
import { Resources } from 'tests/src/fixtures/type';

import { WatchHubSchema } from 'database/schemas';

export class UpdateWatchHubTest extends APITestCase {
  protected watchHubId: UUID;

  async setUp() {
    super.setUp();

    await this.loadFixture(Resources.USERS);
    await this.loadFixture(Resources.SESSIONS);
    const watchHubs = await this.loadFixture(Resources.WATCH_HUBS);

    this.watchHubId = watchHubs[1].id as UUID;
  }

  async testUpdateWatchHub() {
    const result = await this.simulatePut<WatchHubSchema>({
      path: `/watchHubs/${this.watchHubId}`,
      token: constants.sessions.TOKEN_3,
      payload: {
        name: 'A Updated Christmas List',
        privacy: 'public'
      }
    });

    this.assertThat(result.id).isEqual(this.watchHubId);
    this.assertThat(result.privacy).isEqual('public');
    this.assertThat(result.name).isEqual('A Updated Christmas List');
  }

  async testReturnErrorWhenAuthenticationTokenIsNotSent() {
    const result = await this.simulatePut<APIError>({
      path: `/watchHubs/${this.watchHubId}`,
      statusCode: 401,
      payload: {
        name: 'A Updated Christmas List',
        privacy: 'public'
      }
    });

    this.assertThat(result.code).isEqual('UNAUTHORIZED');
  }

  async testReturnErrorWhenWatchHubIsNotFound() {
    const result = await this.simulatePut<APIError>({
      path: `/watchHubs/${this.generateUUID()}`,
      statusCode: 404,
      token: constants.sessions.TOKEN_3,
      payload: {
        name: 'A Updated Christmas List',
        privacy: 'public'
      }
    });

    this.assertThat(result.code).isEqual('WATCH_HUB_NOT_FOUND');
  }
}
