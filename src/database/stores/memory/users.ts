import AbstractMemoryStore from './abstractMemoryStore';
import { NotFound, UserNotFound } from '../errors';
import { User } from 'moviesFreak/entities';
import { UUID } from 'types';

export default class MemoryUsersStore extends AbstractMemoryStore<User> {
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
