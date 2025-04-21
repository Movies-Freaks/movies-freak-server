import TestCase from 'tests/src/testCase';

import CreateWatchHub from 'moviesFreak/watchHubs/create';
import { CouldNotCreateWatchHub } from 'moviesFreak/watchHubs/errors';
import { Resources } from 'tests/src/fixtures/type';
import { User, WatchHub } from 'moviesFreak/entities';
import { WatchHubPrivacy } from 'moviesFreak/entities/types';

export default class CreateWatchHubTest extends TestCase {
  createWatchHub: CreateWatchHub;
  owners: User[];

  async setUp() {
    super.setUp();

    this.database = this.getDatabase();
    this.owners = await this.loadFixture(Resources.USERS);

    this.createWatchHub = new CreateWatchHub(
      this.database,
      this.owners[3],
      'Horroctober',
      WatchHubPrivacy.SHARED,
      'A collection of horror movies for marathon october'
    );
  }

  tearDown() {
    super.tearDown();
    this.removeDatabase();
  }

  async testCreateWatchHub() {
    const watchHub = await this.createWatchHub.execute();

    this.assertThat(watchHub).isInstanceOf(WatchHub);
    this.assertThat(watchHub.id).doesExist();
    this.assertThat(watchHub.name).isEqual('Horroctober');
    this.assertThat(watchHub.privacy).isEqual(WatchHubPrivacy.SHARED);
    this.assertThat(watchHub.ownerId).isEqual('5c54e81b-589a-4d29-96c4-1519ba407dc0');
    this.assertThat(watchHub.description)
      .isEqual('A collection of horror movies for marathon october');
  }

  async testThrowErrorWhenDatabaseFails() {
    this.stubFunction(this.database.watchHubs, 'create')
      .throws(new Error());

    await this.assertThat(
      this.createWatchHub.execute()
    ).willBeRejectedWith(CouldNotCreateWatchHub);
  }
}
