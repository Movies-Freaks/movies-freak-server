import MoviesFreakError from 'error';

export class DatabaseError extends MoviesFreakError {}

export class DatabaseDriverNotSupported extends DatabaseError {
  constructor(driver: string) {
    super({
      info: { driver }
    });
  }
}
