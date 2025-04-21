import constants from './constants';

import { WatchHubPrivacy } from 'moviesFreak/entities/types';

const watchHubsFixture = [
  {
    id: constants.watchHubs.HALLOWEEN_ID,
    name: 'Halloween Marathon',
    privacy: WatchHubPrivacy.PUBLIC,
    description: 'A list of movies you can watch on halloween.',
    ownerId: constants.users.HERMIONE_ID
  },
  {
    id: constants.watchHubs.CHRISTMAS_ID,
    name: 'A Very Christmas List',
    privacy: WatchHubPrivacy.SHARED,
    description: 'A list of movies you can watch on christmas eve.',
    ownerId: constants.users.CEDRIC_ID
  },
  {
    id: constants.watchHubs.VALENTINE_ID,
    name: 'Saint Valentine',
    privacy: WatchHubPrivacy.PRIVATE,
    description: 'List of movies to watch with your partner.',
    ownerId: constants.users.HERMIONE_ID
  },
  {
    id: constants.watchHubs.STAR_WARS_ID,
    name: 'Start Wars Timeline',
    privacy: WatchHubPrivacy.PUBLIC,
    description: 'The timeline for the star wars movies.',
    ownerId: constants.users.CEDRIC_ID
  },
  {
    id: constants.watchHubs.MCU_ID,
    name: 'MCU Timeline',
    privacy: WatchHubPrivacy.PRIVATE,
    description: 'How to know what movie to watch when a new one is released.',
    ownerId: constants.users.NARCISA_ID
  }
];

export default watchHubsFixture;
