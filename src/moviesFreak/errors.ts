import MoviesFreakError from 'error';
import { UUID } from 'types';

export class CouldNotCreateMovie extends MoviesFreakError {
  constructor(error: Error) {
    super({ error });
  }
}

export class CouldNotGetMovies extends MoviesFreakError {
  constructor(error: Error) {
    super({ error });
  }
}

export class CouldNotCreateWatchHub extends MoviesFreakError {
  constructor(error: Error) {
    super({ error });
  }
}

export class CouldNotGetWatchHubs extends MoviesFreakError {
  constructor(error: Error) {
    super({ error });
  }
}

export class MovieNotFound extends MoviesFreakError {
  constructor(error: Error, id?: UUID) {
    super({ error, info: { id } });
  }
}

export class CouldNotGetMovie extends MoviesFreakError {
  constructor(error: Error) {
    super({ error });
  }
}
