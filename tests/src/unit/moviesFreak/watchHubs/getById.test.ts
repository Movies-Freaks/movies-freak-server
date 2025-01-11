import TestCase from 'tests/src/testCase';
import watchHubsFixture from 'tests/src/fixtures/watchHubs';

import GetWatchHubById from 'moviesFreak/watchHubs/getById';
import { CouldNotGetWatchHub, WatchHubNotFound } from 'moviesFreak/watchHubs/errors';
import { Database } from 'database';
import { DatabaseError } from 'database/errors';
import { UUID } from 'types';
import { WatchHub, WatchHubPrivacy } from 'moviesFreak/entities';

export default class GetWatchHubByIdTest extends TestCase {
  protected database: Database;
  protected watchHubId: UUID

  async setUp() {
    super.setUp();

    this.database = this.getDatabase();
    const watchHubs = await this.loadFixtures();

    this.watchHubId = watchHubs[1].id;
  }

  async testReturnWatchHubByItsId() {
    const getWatchHubById = new GetWatchHubById(this.database, this.watchHubId);
    const watchHub = await getWatchHubById.execute();

    this.assertThat(watchHub).isInstanceOf(WatchHub);
    this.assertThat(watchHub.id).isEqual(this.watchHubId);
    this.assertThat(watchHub.privacy).isEqual(WatchHubPrivacy.SHARED);
    this.assertThat(watchHub.name).isEqual('A Very Christmas List');
  }

  async testThrowErrorWhenWatchHubIsNotFound() {
    const getMovieById = new GetWatchHubById(this.database, this.generateUUID());

    this.assertThat(
      getMovieById.execute()
    ).willBeRejectedWith(WatchHubNotFound);
  }

  async testThrowUnexpectedError() {
    this.stubFunction(this.database.watchHubs, 'findById')
      .rejects(new DatabaseError());

    const getMovieById = new GetWatchHubById(this.database, this.watchHubId);

    await this.assertThat(
      getMovieById.execute()
    ).willBeRejectedWith(CouldNotGetWatchHub);
  }

  private async loadFixtures() {
    const promises = watchHubsFixture.map((watchHubData) => {
      const watchHub = new WatchHub(watchHubData);
      return this.database.watchHubs.create(watchHub);
    });

    return Promise.all(promises);
  }
}
