import { CouldNotCreateEntity, CouldNotGetEntities, EntityNotFound } from '../errors';

export class CouldNotCreateMovie extends CouldNotCreateEntity {}
export class CouldNotGetMovie extends CouldNotGetEntities {}
export class CouldNotGetMovies extends CouldNotGetEntities {}
export class MovieNotFound extends EntityNotFound {}
