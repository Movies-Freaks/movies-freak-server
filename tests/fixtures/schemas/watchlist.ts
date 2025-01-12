import {
  DATETIME,
  ENUM,
  INTEGER,
  JSON,
  STRING,
  UUID
} from './types';

const watchlist = JSON(
  {
    id: UUID,
    name: STRING({ min: 1, max: 100 }),
    privacity: ENUM('public', 'private', 'shared'),
    description: STRING({ min: 10, max: 500 }),
    totalFilms: INTEGER({ min: 0, max: 250 }),
    totalTVEpisodes: INTEGER({ min: 0, max: 250 }),
    createAt: DATETIME,
    updatedAt: DATETIME
  },
  ['id', 'name', 'description', 'totalFilms', 'totalTVEpisodes']
);

export default watchlist;
