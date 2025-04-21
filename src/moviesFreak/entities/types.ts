import { WatchHubSchema } from 'database/schemas';

export enum CollaborationType {
  ADMIN = 'admin',
  EDITOR = 'editor',
  REMOVED = 'removed',
  VIEWER = 'viewer'
}

export enum WatchHubPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SHARED = 'shared'
}

export type Collaboration = {
  type: CollaborationType,
  watchHub: WatchHubSchema
};
