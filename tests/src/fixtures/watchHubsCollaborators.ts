import { CollaborationType } from 'moviesFreak/entities/types';
import constants from './constants';

const watchHubsCollaborators = [
  {
    id: constants.users.HERMIONE_ID,
    collaborations: [
      {
        watchHub: { id: constants.watchHubs.HALLOWEEN_ID },
        type: CollaborationType.ADMIN
      },
      {
        watchHub: { id: constants.watchHubs.MCU_ID },
        type: CollaborationType.REMOVED
      }
    ]
  },
  {
    id: constants.users.ALBUS_ID,
    collaborations: [
      {
        watchHub: { id: constants.watchHubs.CHRISTMAS_ID },
        type: CollaborationType.EDITOR
      },
      {
        watchHub: { id: constants.watchHubs.STAR_WARS_ID },
        type: CollaborationType.EDITOR
      }
    ]
  },
  {
    id: constants.users.CEDRIC_ID,
    collaborations: [
      {
        watchHub: { id: constants.watchHubs.CHRISTMAS_ID },
        type: CollaborationType.REMOVED
      },
      {
        watchHub: { id: constants.watchHubs.VALENTINE_ID },
        type: CollaborationType.ADMIN
      }
    ]
  },
  {
    id: constants.users.NEWTON_ID,
    collaborations: [
      {
        watchHub: { id: constants.watchHubs.STAR_WARS_ID },
        type: CollaborationType.VIEWER
      },
      {
        watchHub: { id: constants.watchHubs.CHRISTMAS_ID },
        type: CollaborationType.EDITOR
      }
    ]
  },
  {
    id: constants.users.NARCISA_ID,
    collaborations: [
      {
        watchHub: { id: constants.watchHubs.MCU_ID },
        type: CollaborationType.VIEWER
      },
      {
        watchHub: { id: constants.watchHubs.HALLOWEEN_ID },
        type: CollaborationType.VIEWER
      }
    ]
  }
];

export default watchHubsCollaborators;
