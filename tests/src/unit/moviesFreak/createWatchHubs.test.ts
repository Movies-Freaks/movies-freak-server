import TestCase from 'tests/src/testCase';

import CreateWatchHub from 'moviesFreak/createWatchHub';
import { CouldNotCreateWatchHub } from 'moviesFreak/errors';
import { Database } from 'database';
import { WatchHub, WatchHubPrivacy } from 'moviesFreak/entities';

export default class CreateWatchHubTest extends TestCase {
  protected createWatchHub: CreateWatchHub;
  protected database: Database;

  setUp() {
    super.setUp();

    this.database = this.getDatabase();
    this.createWatchHub = new CreateWatchHub(
      this.database,
      'Horroctober',
      WatchHubPrivacy.SHARED,
      'A collection of horror movies for marathon october'
    );
  }

  async testCreateWatchHub() {
    const watchHub = await this.createWatchHub.execute();

    this.assertThat(watchHub).isInstanceOf(WatchHub);
    this.assertThat(watchHub.id).doesExist();
    this.assertThat(watchHub.name).isEqual('Horroctober');
    this.assertThat(watchHub.privacy).isEqual(WatchHubPrivacy.SHARED);
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
