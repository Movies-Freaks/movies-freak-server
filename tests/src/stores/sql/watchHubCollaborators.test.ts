import constants from 'tests/src/fixtures/constants';
import SQLTestCase from '../testCase';
import { Resources } from 'tests/src/fixtures/type';

import { CollaborationAlreadyExists, WatchHubsCollaboratorNotFound } from 'database/stores/errors';
import { CollaborationType } from 'moviesFreak/entities/types';
import { SQLDatabaseException } from 'database/stores/sql/errors';
import { User, WatchHub, WatchHubsCollaborator } from 'moviesFreak/entities';

class WatchHubsCollaboratorsStoreTest extends SQLTestCase {
  collaborators: User[];
  watchHubs: WatchHub[];
  watchHubsCollaborators: WatchHubsCollaborator[];

  async setUp() {
    super.setUp();

    this.collaborators = await this.loadFixture<User>(Resources.USERS);
    this.watchHubs = await this.loadFixture<WatchHub>(Resources.WATCH_HUBS);
    this.watchHubsCollaborators = await this.loadFixture<WatchHubsCollaborator>(
      Resources.WATCH_HUBS_COLLABORATORS
    );
  }
}

export class CreateWatchHubsCollaboratorTest extends WatchHubsCollaboratorsStoreTest {
  protected watchHubsCollaboratorToCreate: WatchHubsCollaborator;

  async setUp() {
    await super.setUp();

    this.watchHubsCollaboratorToCreate = this.buildWatchHubsCollaborator();
  }

  async testCreateWatchHubsCollaborator() {
    const watchHubsCollaboratorCreated = await this.database
      .watchHubsCollaborators
      .create(this.watchHubsCollaboratorToCreate);

    this.assertThat(watchHubsCollaboratorCreated).isInstanceOf(WatchHubsCollaborator);
    this.assertThat(watchHubsCollaboratorCreated.id).isEqual(constants.users.HARRY_ID);
    this.assertThat(watchHubsCollaboratorCreated.name).isEqual('Harry');
    this.assertThat(watchHubsCollaboratorCreated.firstLastName).isEqual('Potter');
    this.assertThat(watchHubsCollaboratorCreated.collaborations).hasLengthOf(2);

    const [firstCollaboration, secondCollaboration] = watchHubsCollaboratorCreated
      .collaborations
      .sort((a, b) => a.type.localeCompare(b.type));

    this.assertThat(firstCollaboration.watchHub.id).isEqual(this.watchHubs[1].id);
    this.assertThat(firstCollaboration.type).isEqual('admin');

    this.assertThat(secondCollaboration.watchHub.id).isEqual(this.watchHubs[0].id);
    this.assertThat(secondCollaboration.type).isEqual('editor');
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this.database.watchHubsCollaborators, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.watchHubsCollaborators.create(this.watchHubsCollaboratorToCreate)
    ).willBeRejectedWith(SQLDatabaseException);
  }

  private buildWatchHubsCollaborator(): WatchHubsCollaborator {
    const watchHubsCollaborator = new WatchHubsCollaborator({
      id: constants.users.HARRY_ID,
      username: 'albus'
    });

    watchHubsCollaborator.addCollaboration(this.watchHubs[0], CollaborationType.EDITOR);
    watchHubsCollaborator.addCollaboration(this.watchHubs[1], CollaborationType.ADMIN);

    return watchHubsCollaborator;
  }
}

export class AddCollaborationTest extends WatchHubsCollaboratorsStoreTest {
  protected watchHub: WatchHub;
  protected collaborator: User;
  protected collaborationType: CollaborationType;

  async setUp() {
    await super.setUp();

    this.watchHub = this.watchHubs[0];
    this.collaborator = await this.database.users.findById(constants.users.HARRY_ID);
    this.collaborationType = CollaborationType.EDITOR;
  }

  async testAddCollaboration() {
    const watchHubsCollaborator = await this.database
      .watchHubsCollaborators
      .addCollaboration(this.collaborator, this.watchHub, this.collaborationType);

    this.assertThat(watchHubsCollaborator).isInstanceOf(WatchHubsCollaborator);
    this.assertThat(watchHubsCollaborator.id).isEqual(this.collaborator.id);
    this.assertThat(watchHubsCollaborator.name).isEqual(this.collaborator.name);
    this.assertThat(watchHubsCollaborator.firstLastName).isEqual(this.collaborator.firstLastName);
    this.assertThat(watchHubsCollaborator.collaborations).hasLengthOf(1);

    const [collaboration] = watchHubsCollaborator.collaborations;

    this.assertThat(collaboration.watchHub.id).isEqual(this.watchHub.id);
    this.assertThat(collaboration.type).isEqual(this.collaborationType);
  }

  async testAddCollaborationWithExistingCollaborations() {
    const watchHubsCollaborator = await this.database
      .watchHubsCollaborators
      .addCollaboration(this.collaborators[1], this.watchHub, this.collaborationType);

    this.assertThat(watchHubsCollaborator.collaborations).hasLengthOf(3);

    watchHubsCollaborator.collaborations.forEach((collaboration) => {
      this.assertThat(collaboration.watchHub).isInstanceOf(WatchHub);
    });
  }

  async testThrowsErrorWhenCollaborationAlreadyExists() {
    await this.database
      .watchHubsCollaborators
      .addCollaboration(this.collaborator, this.watchHub, this.collaborationType);

    await this.assertThat(
      this.database
        .watchHubsCollaborators
        .addCollaboration(this.collaborator, this.watchHub, this.collaborationType)
    ).willBeRejectedWith(CollaborationAlreadyExists);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this.database.watchHubsCollaborators, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database
      .watchHubsCollaborators
      .addCollaboration(this.collaborator, this.watchHub, this.collaborationType)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindByIdTest extends WatchHubsCollaboratorsStoreTest {
  protected watchHubsCollaborator: WatchHubsCollaborator;

  async setUp() {
    await super.setUp();

    this.watchHubsCollaborator = this.watchHubsCollaborators[0];
  }

  async testFindWatchHubsCollaboratorById() {
    const watchHubsCollaborator = await this.database
      .watchHubsCollaborators
      .findById(this.watchHubsCollaborator.id);

    this.assertThat(watchHubsCollaborator).isInstanceOf(WatchHubsCollaborator);
    this.assertThat(watchHubsCollaborator.id).isEqual(this.watchHubsCollaborator.id);
    this.assertThat(watchHubsCollaborator.name).isEqual('Hermione');
    this.assertThat(watchHubsCollaborator.firstLastName).isEqual('Granger');
    this.assertThat(watchHubsCollaborator.collaborations).hasLengthOf(2);
  }

  async testThrowsErrorWhenWatchHubsCollaboratorIsNotFound() {

    await this.assertThat(
      this.database
        .watchHubsCollaborators
        .findById(constants.users.HARRY_ID)
    ).willBeRejectedWith(WatchHubsCollaboratorNotFound);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this.database.watchHubsCollaborators, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database
      .watchHubsCollaborators
      .findById(this.watchHubsCollaborator.id)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
