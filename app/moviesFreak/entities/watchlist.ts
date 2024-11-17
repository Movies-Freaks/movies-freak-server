import Entity from './entity';
import User from './user';
import { Json, UUID } from '../../../types/common';

class Watchlist extends Entity {
  userId: UUID;
  user?: User;
  totalTVEpisodes?: number;

  constructor(args: Json) {
    super(args.id, args.createdAt, args.updatedAt);

    this.userId = args.userId;
    this.totalTVEpisodes = args.totalTVEpisodes;
  }

  setUser(user: User) {
    this.user = user;
    this.userId = user.id;
  }
}

export default Watchlist;
