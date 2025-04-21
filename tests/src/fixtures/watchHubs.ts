import constants from './constants';
import { WatchHubPrivacy } from 'moviesFreak/entities/types';

const watchHubsFixture = [
  {
    name: 'Halloween Marathon',
    privacy: WatchHubPrivacy.PUBLIC,
    description: 'A list of movies you can watch on halloween.',
    ownerId: constants.USER_1
  },
  {
    name: 'A Very Christmas List',
    privacy: WatchHubPrivacy.SHARED,
    description: 'A list of movies you can watch on christmas eve.',
    ownerId: constants.USER_3
  },
  {
    name: 'Saint Valentine',
    privacy: WatchHubPrivacy.PRIVATE,
    description: 'List of movies to watch with your partner.',
    ownerId: constants.USER_1
  },
  {
    name: 'Start Wars Timeline',
    privacy: WatchHubPrivacy.PUBLIC,
    description: 'The timeline for the star wars movies.',
    ownerId: constants.USER_3
  },
  {
    name: 'MCU Timeline',
    privacy: WatchHubPrivacy.PRIVATE,
    description: 'How to know what movie to watch when a new one is released.',
    ownerId: constants.USER_5
  }
];

export default watchHubsFixture;
