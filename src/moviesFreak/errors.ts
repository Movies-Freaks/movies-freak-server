import MoviesFreakError from 'error';
import { Json, UUID } from 'types';

export class CouldNotCreateEntity extends MoviesFreakError {
  constructor(error: MoviesFreakError) {
    super({ error });
  }
}

export class CouldNotGetEntities extends MoviesFreakError {
  constructor(error: MoviesFreakError) {
    super({ error });
  }
}

export class EntityNotFound extends MoviesFreakError {
  constructor(error: MoviesFreakError, id?: UUID) {
    super({ error, info: { id } });
  }
}

// SIGN UP ERRORS

export class CouldNotSignUp extends MoviesFreakError {
  constructor(error?: MoviesFreakError, info?: Json) {
    super({
      error,
      info,
      message: 'Unexpected error was thrown while signing up.'
    });
  }
}

export class UsernameAlreadyUsed extends CouldNotSignUp {
  constructor(username: string, error?: MoviesFreakError) {
    super(error, { username });

    this.message = `Username ${username} is already in used.`;
  }
}

export class EmailAlreadyUsed extends CouldNotSignUp {
  constructor(email: string, error?: MoviesFreakError) {
    super(error, { email });

    this.message = `Email ${email} is already in used.`;
  }
}
