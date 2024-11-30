import TestCase from 'tests/src/testCase';
import watchHubsFixture from 'tests/src/fixtures/watchHubs';

import GetWatchHubs from 'moviesFreak/getWatchHubs';
import { CouldNotGetWatchHubs } from 'moviesFreak/errors';
import { Database } from 'database';
import { DatabaseError } from 'database/errors';
import { SortOrder } from 'database/stores/types';
import { WatchHub } from 'moviesFreak/entities';

export class GetWatchHubsTest extends TestCase {
  protected database: Database;
  protected watchHubs: WatchHub[];

  async setUp() {
    super.setUp();
    this.database = this.getDatabase();

    await this.loadFixtures();
  }

  async testReturnPaginatedWatchHubs() {
    const getWatchHubs = new GetWatchHubs(this.database, 2, 1);

    const result = await getWatchHubs.execute();

    this.assertThat(result.items).hasLengthOf(2);
    this.assertThat(result.totalItems).isEqual(5);
  }

  async testReturnWatchHubsSortedAscendentByName() {
    const getWatchHubs = new GetWatchHubs(this.database, 10, 0, { name: SortOrder.ASC });

    const result = await getWatchHubs.execute();

    this.assertThat(result.items[0].name).isEqual('A Very Christmas List');
    this.assertThat(result.items[1].name).isEqual('Halloween Marathon');
    this.assertThat(result.items[2].name).isEqual('MCU Timeline');
    this.assertThat(result.items[3].name).isEqual('Saint Valentine');
    this.assertThat(result.items[4].name).isEqual('Start Wars Timeline');
    this.assertThat(result.totalItems).isEqual(5);
  }

  async testReturnWatchHubsSortedDescendentByName() {
    const getWatchHubs = new GetWatchHubs(this.database, 10, 0, { name: SortOrder.DESC });

    const result = await getWatchHubs.execute();

    this.assertThat(result.items[0].name).isEqual('Start Wars Timeline');
    this.assertThat(result.items[1].name).isEqual('Saint Valentine');
    this.assertThat(result.items[2].name).isEqual('MCU Timeline');
    this.assertThat(result.items[3].name).isEqual('Halloween Marathon');
    this.assertThat(result.items[4].name).isEqual('A Very Christmas List');
    this.assertThat(result.totalItems).isEqual(5);
  }

  async testReturnEmptyArrayWhenTotalItemsIsLessThanSkip() {
    const getWatchHubs = new GetWatchHubs(this.database, 100, 100);

    const result = await getWatchHubs.execute();

    this.assertThat(result.items).isEmpty();
    this.assertThat(result.totalItems).isEqual(5);
  }

  async testThrowUnexpectedError() {
    this.stubFunction(this.database.watchHubs, 'findAll')
      .rejects(new DatabaseError());

    const getWatchHubs = new GetWatchHubs(this.database, 10, 0);

    await this.assertThat(
      getWatchHubs.execute()
    ).willBeRejectedWith(CouldNotGetWatchHubs);
  }

  private async loadFixtures() {
    const promises = watchHubsFixture.map((watchHubData) => {
      const watchHub = new WatchHub(watchHubData);
      return this.database.watchHubs.create(watchHub);
    });

    this.watchHubs = await Promise.all(promises);
  }
}
