import { isEmpty, omit } from 'lodash';

import Entity from './entity';
import { UserPasswordSchema, UserSchema } from 'database/schemas';

export class UserPassword {
  private passwordSalt: string;
  private passwordHash: string;

  constructor(params?: UserPasswordSchema) {
    this.passwordHash = params?.hash;
    this.passwordSalt = params?.salt;
  }

  get hash() {
    return this.passwordHash;
  }

  get salt() {
    return this.passwordSalt;
  }
}

export default class User extends Entity{
  birthdate: Date;
  email: string;
  firstLastName: string;
  name: string;
  username: string;
  secondLastName?: string;

  private userPassword: UserPassword;

  constructor(params: UserSchema) {
    super(params.id, params.createdAt, params.updatedAt);

    Object.assign(this, { ...omit(params, 'password') });

    if (!isEmpty(params.password)) {
      this.userPassword = new UserPassword(params.password);
    }
  }

  get password() {
    return {
      hash: this.userPassword.hash,
      salt: this.userPassword.salt
    };
  }
}
