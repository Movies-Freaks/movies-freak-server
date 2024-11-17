import { IMDBError } from '../errors';

export class IncorrectIMDBId extends IMDBError {
  constructor(imdbId: string) {
    super({
      info: { imdbId },
      message: 'Incorrect IMDB Id.'
    });
  }
}

export class InvalidAPIKey extends IMDBError {
  constructor() {
    super({
      message: 'Invalid API key.'
    });
  }
}

export class OMDBException extends IMDBError {
  constructor(error: any) {
    super({
      error,
      message: 'Could not do the request to OMDB.',
    })
  }
}
