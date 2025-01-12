import { UUID } from 'types';
import Entity from './entity';
import { SessionSchema } from 'database/schemas';

export default class Session extends Entity {
  private expirationDate: Date;
  private isTokenActive: boolean;
  private sessionToken: string;

  userId: UUID;

  constructor(params: SessionSchema) {
    super(params.id, params.createdAt, params.updatedAt);

    this.expirationDate = params.expiresAt;
    this.isTokenActive = params.isActive;
    this.sessionToken = params.token;
    this.userId = params.userId;
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
}
