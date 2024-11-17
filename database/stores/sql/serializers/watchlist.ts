import Serializer, { field } from '../serializer';
import { Watchlist } from '../../../../app/moviesFreak/entities';

const WatchlistSerializer = Serializer
  .init<Watchlist>(Watchlist)
  .addSchema(
    field('total_tv_episodes', { from: 'totalTVEpisodes' }),
    field('user_id', { from: 'userId' })
  );

export default WatchlistSerializer;
