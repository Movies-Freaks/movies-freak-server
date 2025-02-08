import AbstractMemoryStore from './abstractMemoryStore';
import { Json, UUID } from 'types';
import { Sort } from '../types';
import { User } from 'moviesFreak/entities';
import {
  EmailAlreadyExists,
  NotFound,
  UsernameAlreadyExists,
  UserNotFound
} from '../errors';

export default class MemoryUsersStore extends AbstractMemoryStore<User> {
  async create(user: User) {
    try {
      await this.findOne({ username: user.username });

      throw new UsernameAlreadyExists(user.username)
    } catch (error) {
      if (!(error instanceof NotFound)) throw error;
    }

    try {
      await this.findOne({ email: user.email });

      throw new EmailAlreadyExists(user.email)
    } catch (error) {
      if (!(error instanceof NotFound)) throw error;
    }

    return super.create(user);
  }

  async findById(userId: UUID) {
    try {
      return await super.findById(userId);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new UserNotFound({ id: userId });
      }

      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.findOne({ email });
  }

  protected async findOne(filter: Json, sort?: Sort): Promise<User> {
    try {
      return await super.findOne(filter, sort);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new UserNotFound({ filter, sort });
      }

      throw error;
    }
  }
}
