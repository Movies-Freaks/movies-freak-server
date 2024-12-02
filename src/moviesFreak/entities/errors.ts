import MoviesFreakError from 'error';

export class EntityError extends MoviesFreakError {}

export class SessionDoesNotBelongToUser extends EntityError {
  constructor() {
    super({ message: 'User sent does not match with the session owner' });
  }
}
