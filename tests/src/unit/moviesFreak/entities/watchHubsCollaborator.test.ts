import TestCase from 'tests/src/testCase';

import { CollaborationType, WatchHubPrivacy } from 'moviesFreak/entities/types';
import { User, WatchHub, WatchHubsCollaborator } from 'moviesFreak/entities';
import { WatchHubAlreadyShared } from 'moviesFreak/entities/errors';

class WatchHubsCollaboratorTest extends TestCase {
  protected watchHubsCollaborator: WatchHubsCollaborator;
  protected watchHub: WatchHub;

  setUp() {
    super.setUp();

    const collaborator = new User({
      id: this.generateUUID(),
      email: 'jon@gmail.com',
      username: 'jon',
      firstLastName: 'Snow',
      secondLastName: 'Stark'
    });
    this.watchHub = new WatchHub({
      id: this.generateUUID(),
      description: 'Horror movies to watch on Halloween',
      name: 'Hoctoberfest 2025',
      privacy: WatchHubPrivacy.PRIVATE
    });

    this.watchHubsCollaborator = new WatchHubsCollaborator({
      id: collaborator.id,
      username: collaborator.username,
      firstLastName: collaborator.firstLastName,
      secondLastName: collaborator.secondLastName,
    });
  }
}

export class AddCollaborationTest extends WatchHubsCollaboratorTest {
  testAddCollaboration() {
    this.assertThat(this.watchHubsCollaborator.collaborations).isEmpty();

    this.watchHubsCollaborator.addCollaboration(this.watchHub, CollaborationType.EDITOR);

    const [collaboration] = this.watchHubsCollaborator.collaborations;

    this.assertThat(this.watchHubsCollaborator.collaborations).hasLengthOf(1);
    this.assertThat(collaboration.watchHub).isEqual(this.watchHub);
    this.assertThat(collaboration.type).isEqual(CollaborationType.EDITOR);
  }

  testThrowsErrorWhenAlreadyHaveAnotherCollaboration() {
    this.watchHubsCollaborator.addCollaboration(this.watchHub, CollaborationType.EDITOR);

    this.assertThat(
      () => this.watchHubsCollaborator.addCollaboration(this.watchHub, CollaborationType.EDITOR)
    ).willThrow(WatchHubAlreadyShared);
  }
}
