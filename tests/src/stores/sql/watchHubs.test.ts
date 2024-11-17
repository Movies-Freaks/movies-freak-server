import { WatchHub } from 'moviesFreak/entities';
import SQLTestCase from '../testCase';
import watchHubsFixture from 'tests/src/fixtures/watchHubs';
import { WatchHubPrivacy } from 'database/schemas';
import Serializer, { SerializerError } from 'jesusx21/serializer';
import { SQLDatabaseException } from 'database/stores/sql/errors';
import { UUID } from 'types';
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
