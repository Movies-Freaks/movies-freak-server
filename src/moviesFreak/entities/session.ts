import Crypto from 'crypto';
import DateUtils from 'jesusx21/dateUtils';
import { isNil } from 'lodash';

import Entity from './entity';
import User from './user';
import { SessionDoesNotBelongToUser } from './errors';
import { SessionSchema } from 'database/schemas';
import { UUID } from 'types';

export default class Session extends Entity {
  private expirationDate: Date;
  private isTokenActive: boolean;
  private sessionToken: string;
  private sessionUser: User;
  private sessionUserId: UUID;

  constructor(params: Partial<SessionSchema>) {
    super(params.id, params.createdAt, params.updatedAt);

    this.expirationDate = params.expiresAt;
    this.isTokenActive = params.isActive ?? false;
    this.sessionToken = params.token;
    this.sessionUserId = params.userId;
  }

  static createForUser(user: User) {
    const session = new Session({ userId: user.id });

    session.addUser(user);

    return session;
  }

  get expiresAt() {
    return this.expirationDate;
  }

  get isActive() {
    return this.isTokenActive;
  }

  get token() {
    return this.sessionToken;
  }

  get user() {
    return this.sessionUser;
  }

  get userId() {
    return this.sessionUserId;
  }

  activateToken() {
    if (this.isActive) return this;

    this.expirationDate = DateUtils.getDateNYearsFromNow(1);
    this.isTokenActive = true;

    return this;
  }

  addUser(user: User) {
    if (!isNil(this.sessionUserId) && this.sessionUserId !== user.id) {
      throw new SessionDoesNotBelongToUser();
    }

    this.sessionUser = user;
    this.sessionUserId = user.id;

    return this;
  }

  deactivateToken() {
    if (!this.isExpired()) {
      this.expirationDate = new Date();
    }

    this.isTokenActive = false;

    return this;
  }

  generateToken() {
    this.deactivateToken();

    this.sessionToken = Crypto
      .randomBytes(32)
      .toString('hex');

    return this;
  }

  isExpired() {
    if (isNil(this.expirationDate)) {
      return true;
    }

    return this.expirationDate <= new Date();
  }
}
