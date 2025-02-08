import { APIError, HTTPStatusCode } from 'jesusx21/boardGame/types';

import APITestCase from '../apiTestCase';
import constants from 'tests/src/fixtures/constants';
import { Resources } from 'tests/src/fixtures/type';

import GetWatchHubs from 'moviesFreak/watchHubs/getList';
import { WatchHub } from 'moviesFreak/entities';
import { WatchHubList } from 'api/v1/types';

export class GetWatchHubsTest extends APITestCase {
  protected watchHubs: WatchHub[];

  async setUp() {
    super.setUp();


    await this.loadFixture(Resources.USERS);
    await this.loadFixture(Resources.SESSIONS);
    this.watchHubs = await this.loadFixture(Resources.WATCH_HUBS);
  }

  async testGetWatchHubsWithoutSendingPagination() {
    const result = await this.simulateGet<WatchHubList>({
      path: '/watchHubs',
      token: constants.TOKEN_3
    });

    this.assertThat(result.items).hasLengthOf(5);
    this.assertThat(result.pagination.page).isEqual(1);
    this.assertThat(result.pagination.perPage).isEqual(25);
    this.assertThat(result.pagination.totalPages).isEqual(1);
  }

  async testGetWatchHubsWithoutSendingPage() {
    const result = await this.simulateGet<WatchHubList>({
      path: '/watchHubs',
      query: { perPage: 2 },
      token: constants.TOKEN_3
    });

    this.assertThat(result.items).hasLengthOf(2);
    this.assertThat(result.pagination.page).isEqual(1);
    this.assertThat(result.pagination.perPage).isEqual(2);
    this.assertThat(result.pagination.totalPages).isEqual(3);
  }

  async testGetWatchHubsWithoutSendingPerPage() {
    const result = await this.simulateGet<WatchHubList>({
      path: '/watchHubs',
      query: { page: 1 },
      token: constants.TOKEN_3
    });

    this.assertThat(result.items).hasLengthOf(5);
    this.assertThat(result.pagination.page).isEqual(1);
    this.assertThat(result.pagination.perPage).isEqual(25);
    this.assertThat(result.pagination.totalPages).isEqual(1);
  }

  async testGetWatchHubsWithSendingPagination() {
    const result = await this.simulateGet<WatchHubList>({
      path: '/watchHubs',
      query: { page: 3, perPage: 2 },
      token: constants.TOKEN_3
    });

    this.assertThat(result.items).hasLengthOf(1);
    this.assertThat(result.pagination.page).isEqual(3);
    this.assertThat(result.pagination.perPage).isEqual(2);
    this.assertThat(result.pagination.totalPages).isEqual(3);
  }

  async testGetWatchHubsWithAscendingSort() {
    const result = await this.simulateGet<WatchHubList>({
      path: '/watchHubs',
      query: { sort: 'name' },
      token: constants.TOKEN_3
    });

    this.assertThat(result.items[0].name).isEqual('A Very Christmas List');
    this.assertThat(result.items[1].name).isEqual('Halloween Marathon');
    this.assertThat(result.items[2].name).isEqual('MCU Timeline');
    this.assertThat(result.items[3].name).isEqual('Saint Valentine');
    this.assertThat(result.items[4].name).isEqual('Start Wars Timeline');
  }

  async testGetMoviesWithDescendingSort() {
    const result = await this.simulateGet<WatchHubList>({
      path: '/watchHubs',
      query: { sort: '-name' },
      token: constants.TOKEN_3
    });

    this.assertThat(result.items[0].name).isEqual('Start Wars Timeline');
    this.assertThat(result.items[1].name).isEqual('Saint Valentine');
    this.assertThat(result.items[2].name).isEqual('MCU Timeline');
    this.assertThat(result.items[3].name).isEqual('Halloween Marathon');
    this.assertThat(result.items[4].name).isEqual('A Very Christmas List');
  }

  async testReturnErrorWhenAuthenticationTokenIsNotSent() {
    const result = await this.simulateGet<APIError>({
      path: '/watchHubs',
      statusCode: 401
    });

    this.assertThat(result.code).isEqual('UNAUTHORIZED');
  }

  async testReturnErrorWhenUserIsNotAuthenticated() {
    const result = await this.simulateGet<APIError>({
      path: '/watchHubs',
      statusCode: 401,
      token: constants.TOKEN_4
    });

    this.assertThat(result.code).isEqual('TOKEN_EXPIRED');
  }

  async testReturnsErrorOnUnexpectedError() {
    this.mockClass(GetWatchHubs, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulateGet<APIError>({
      path: '/watchHubs',
      statusCode: HTTPStatusCode.UNEXPECTED_ERROR,
      token: constants.TOKEN_3
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
