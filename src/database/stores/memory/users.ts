import AbstractMemoryStore from './abstractMemoryStore';
import { User } from 'moviesFreak/entities';
import { UUID } from 'types';
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
}
