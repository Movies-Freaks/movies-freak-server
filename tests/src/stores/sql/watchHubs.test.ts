import Serializer, { SerializerError } from 'jesusx21/serializer';

import SQLTestCase from '../testCase';
import watchHubsFixture from 'tests/src/fixtures/watchHubs';

import { SQLDatabaseException } from 'database/stores/sql/errors';
import { UUID } from 'types';
import { WatchHub, WatchHubPrivacy } from 'moviesFreak/entities';
import { WatchHubNotFound } from 'database/stores/errors';

class WatchHubsStoreTest extends SQLTestCase {
  protected watchHubs: WatchHub[];

  async setUp() {
    super.setUp();

    await this.loadFixtures();
  }

  private async loadFixtures() {
    const promises = watchHubsFixture.map((watchHubData) => {
      const watchHub = new WatchHub(watchHubData);

      return this.database.watchHubs.create(watchHub);
    });

    this.watchHubs = await Promise.all(promises);
  }
}

export class CreateWatchHubTest extends WatchHubsStoreTest {
  protected watchHubToCreate: WatchHub;

  async setUp() {
    await super.setUp();

    this.watchHubToCreate = this.buildWatchHub();
  }

  async testCreateWatchHub() {
    const watchHubCreated = await this.database
      .watchHubs
      .create(this.watchHubToCreate);

    this.assertThat(watchHubCreated).isInstanceOf(WatchHub);
    this.assertThat(watchHubCreated.id).doesExist();
    this.assertThat(watchHubCreated.name).isEqual('Conjuring Universe');
    this.assertThat(watchHubCreated.description).isEqual('A timeline for the conjuring movies');
    this.assertThat(watchHubCreated.privacy).isEqual('public');
  }

  async testThrowErrorOnSerializationError() {
    this.mockClass(Serializer<WatchHub>)
      .expects('fromJson')
      .throws(new SerializerError());

    await this.assertThat(
      this.database
        .watchHubs
        .create(this.watchHubToCreate)
    ).willBeRejectedWith(SerializerError);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this.database.watchHubs, 'connection')
      .throws(new SerializerError());

    await this.assertThat(
      this.database.watchHubs.create(this.buildWatchHub())
    ).willBeRejectedWith(SQLDatabaseException);
  }

  private buildWatchHub() {
    return new WatchHub({
      name: 'Conjuring Universe',
      description: 'A timeline for the conjuring movies',
      privacy: WatchHubPrivacy.PUBLIC
    });
  }
}

export class FindByIdTest extends WatchHubsStoreTest {
  protected watchHubId: UUID;

  async setUp(){
    await super.setUp();

    this.watchHubId = this.watchHubs[1].id;
  }

  async testFindWatchHubById() {
    const watchHubFound = await this.database
      .watchHubs
      .findById(this.watchHubId);

    this.assertThat(watchHubFound).isInstanceOf(WatchHub);
    this.assertThat(watchHubFound.id).isEqual(this.watchHubId);
    this.assertThat(watchHubFound.name).isEqual('A Very Christmas List');
  }

  async testThrowsErrorWhenWatchHubIsNotFound() {
    this.watchHubId = this.generateUUID();

    await this.assertThat(
      this.database
        .watchHubs
        .findById(this.watchHubId)
    ).willBeRejectedWith(WatchHubNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.watchHubs, 'connection')
      .throws(new SerializerError());

    await this.assertThat(
      this.database
        .watchHubs
        .findById(this.watchHubId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindAll extends WatchHubsStoreTest {
  async testFindAllWatchHubs() {
    const { totalItems, items: watchHubs } = await this.database
      .watchHubs
      .findAll(100, 0);

    this.assertThat(watchHubs).hasLengthOf(5);
    this.assertThat(totalItems).isEqual(5);

    watchHubs.forEach((watchHub) => this.assertThat(watchHub).isInstanceOf(WatchHub));
  }

  async testFindWithSkipAndLimit() {
    const { totalItems, items: watchHubs } = await this.database
      .watchHubs
      .findAll(2, 1);

    this.assertThat(watchHubs).hasLengthOf(2);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(watchHubs[0].name).isEqual('A Very Christmas List');
    this.assertThat(watchHubs[1].name).isEqual('Saint Valentine');
  }

  async testReturnEmptyListWhenThereIsNotWatchHubs() {
    await this.cleanDatabase();
    this.buildDatabase();

    const { totalItems, items: watchHubs } = await this.getDatabase()
      .watchHubs
      .findAll(100, 0);

    this.assertThat(watchHubs).isEmpty();
    this.assertThat(totalItems).isEqual(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this.database.watchHubs, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database
        .watchHubs
        .findAll(100, 0)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
