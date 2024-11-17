import { WatchHubPrivacy } from "database/schemas";

const watchHubsFixture = [
  {
    name: 'Halloween Marathon',
    privacy: WatchHubPrivacy.PUBLIC,
    description: 'A list of movies you can watch on halloween.',
  },
  {
    name: 'A Very Christmas List',
    privacy: WatchHubPrivacy.SHARED,
    description: 'A list of movies you can watch on christmas eve.',
  },
  {
    name: 'Saint Valentine',
    privacy: WatchHubPrivacy.PRIVATE,
    description: 'List of movies to watch with your partner.',
  },
  {
    name: 'Start Wars Timeline',
    privacy: WatchHubPrivacy.PUBLIC,
    description: 'The timeline for the star wars movies.',
  },
  {
    name: 'MCU Timeline',
    privacy: WatchHubPrivacy.PRIVATE,
    description: 'How to know what movie to watch when a new one is released.',
  }
];

export default watchHubsFixture;
