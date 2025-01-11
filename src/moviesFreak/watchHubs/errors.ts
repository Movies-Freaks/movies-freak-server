import { CouldNotCreateEntity, CouldNotGetEntities, EntityNotFound } from '../errors';

export class CouldNotCreateWatchHub extends CouldNotCreateEntity {}
export class CouldNotGetWatchHub extends CouldNotGetEntities {}
export class CouldNotGetWatchHubs extends CouldNotGetEntities {}
export class WatchHubNotFound extends EntityNotFound {}
