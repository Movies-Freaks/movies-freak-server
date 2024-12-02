import Crypto from 'crypto';
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

  static encrypt(password: string) {
    const salt = Crypto
      .randomBytes(8)
      .toString('hex');

    const encrypter = Crypto.createHmac('sha512', salt);
    encrypter.update(password);

    const hash = encrypter.digest('hex');

    return new UserPassword({ hash, salt });
  }
}

export default class User extends Entity{
  email: string;
  username: string;
  name?: string;
  birthdate?: Date;
  firstLastName?: string;
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

  addPassword(password: string) {
    this.userPassword = UserPassword.encrypt(password);
  }
}
