import CreateMovie from './create';
import GetMovieList from './getList';
import GetMovieById from './getById';

const Movies = {
  Create: CreateMovie,
  GetById: GetMovieById,
  GetList: GetMovieList
};

export default Movies;
