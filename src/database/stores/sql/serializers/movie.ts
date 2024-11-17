import Serializer, { field } from 'jesusx21/serializer';
import { OptionAs } from 'jesusx21/serializer/types';

import { Movie } from 'moviesFreak/entities';

const MovieSerializer = Serializer
  .init<Movie>(Movie)
  .addSchema(
    field('id'),
    field('name'),
    field('plot'),
    field('title'),
    field('year'),
    field('rated'),
    field('runtime'),
    field('director'),
    field('poster'),
    field('production'),
    field('genre', { as: OptionAs.ARRAY }),
    field('writers', { as: OptionAs.ARRAY }),
    field('actors', { as: OptionAs.ARRAY }),
    field('imdb_id', { from: 'imdbId' }),
    field('imdb_rating', { from: 'imdbRating' }),
    field('created_at', { from: 'createdAt' }),
    field('updated_at', { from: 'updatedAt' })
  );

export default MovieSerializer;
