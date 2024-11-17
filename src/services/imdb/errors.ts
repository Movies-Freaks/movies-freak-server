import MoviesFreakError from 'error';

export class IMDBError extends MoviesFreakError {}
export class MissingIMDBCredentials extends IMDBError {};
export class ResultIsNotACollection extends IMDBError {};

export class IMDBDriverNotSupported extends IMDBError {
  readonly driver: string;

  constructor(driver: string) {
    super({
      message: `Driver ${driver} not supported`,
      info: { driver }
    });
  }
}
