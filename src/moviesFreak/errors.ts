import MoviesFreakError from 'error';

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
