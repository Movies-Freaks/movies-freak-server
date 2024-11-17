import { WatchHubPrivacy } from 'moviesFreak/entities';
import APITestCase from '../apiTestCase';
import CreateWatchHub from 'moviesFreak/createWatchHub';

export class CreateWatchHubTest extends APITestCase {
  async testCreateWatchHub() {
    const body = await this.simulatePost({
      path: '/watchHubs',
      statusCode: 201,
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

  async testReturnErrorWhenPrivacyIsNotSupported() {
    const result = await this.simulatePost({
      path: '/watchHubs',
      statusCode: 400,
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

    const result = await this.simulatePost({
      path: '/watchHubs',
      statusCode: 500,
      payload: {
        name: 'Horroctober',
        description: 'A list of movies for your halloween marathon',
        privacy: WatchHubPrivacy.PUBLIC
      }
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
