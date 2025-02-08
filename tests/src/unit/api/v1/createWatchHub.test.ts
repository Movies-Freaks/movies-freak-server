import { APIError } from 'jesusx21/boardGame/types';

import APITestCase from '../apiTestCase';
import constants from 'tests/src/fixtures/constants';
import { Resources } from 'tests/src/fixtures/type';

import CreateWatchHub from 'moviesFreak/watchHubs/create';
import { WatchHubPrivacy } from 'moviesFreak/entities';
import { WatchHubSchema } from 'database/schemas';

export class CreateWatchHubTest extends APITestCase {
  async setUp() {
    super.setUp();

    await this.loadFixture(Resources.USERS);
    await this.loadFixture(Resources.SESSIONS);
  }

  async testCreateWatchHub() {
    const body = await this.simulatePost<WatchHubSchema>({
      path: '/watchHubs',
      statusCode: 201,
      token: constants.TOKEN_3,
      payload: {
        name: 'Horroctober',
        description: 'A list of movies for your halloween marathon',
        privacy: WatchHubPrivacy.PRIVATE
      }
    });

    this.assertThat(body.id).doesExist();
    this.assertThat(body.name).isEqual('Horroctober');
    this.assertThat(body.description).isEqual('A list of movies for your halloween marathon');
    this.assertThat(body.privacy).isEqual(WatchHubPrivacy.PRIVATE);
    this.assertThat(body.createdAt).doesExist();
    this.assertThat(body.updatedAt).doesExist();
  }

  async testReturnErrorWhenAuthenticationTokenIsNotSent() {
    const result = await this.simulatePost<APIError>({
      path: '/watchHubs',
      statusCode: 401,
      payload: {
        name: 'Horroctober',
        description: 'A list of movies for your halloween marathon',
        privacy: 'privacy'
      }
    });

    this.assertThat(result.code).isEqual('UNAUTHORIZED');
  }

  async testReturnErrorWhenUserIsNotAuthenticated() {
    const result = await this.simulatePost<APIError>({
      path: '/watchHubs',
      statusCode: 401,
      token: constants.TOKEN_4,
      payload: {
        name: 'Horroctober',
        description: 'A list of movies for your halloween marathon',
        privacy: 'privacy'
      }
    });

    this.assertThat(result.code).isEqual('TOKEN_EXPIRED');
  }

  async testReturnErrorWhenPrivacyIsNotSupported() {
    const result = await this.simulatePost<APIError>({
      path: '/watchHubs',
      statusCode: 400,
      token: constants.TOKEN_3,
      payload: {
        name: 'Horroctober',
        description: 'A list of movies for your halloween marathon',
        privacy: 'privacy'
      }
    });

    this.assertThat(result.code).isEqual('PRIVACY_NOT_SUPPORTED');
  }

  async testReturnHandledErrorOnUnexpectedError() {
    this.mockClass(CreateWatchHub, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulatePost<APIError>({
      path: '/watchHubs',
      statusCode: 500,
      token: constants.TOKEN_3,
      payload: {
        name: 'Horroctober',
        description: 'A list of movies for your halloween marathon',
        privacy: WatchHubPrivacy.PUBLIC
      }
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
