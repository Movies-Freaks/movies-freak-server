import { Monopoly } from '../../../boardGame';
import {
  HTTPStatusCode,
  MultipleRespponse,
  Request,
  SingleResponse
} from '../../../boardGame/types';

import { HTTPInternalError } from '../../httpResponses';
import { Film } from '../../../app/moviesFreak/entities';
import { QueryResponse } from '../../../types/database';

class FilmsResource extends Monopoly {
  async onGet({ query }: Request): Promise<MultipleRespponse> {
    const { database, presenters } = this.getTitles();
    const skip = Number(query.skip || 0);
    const limit = Number(query.limit || 25);

    let result: QueryResponse<Film>;

    try {
      result = await database.films.find({ skip, limit });
    } catch (error: any) {
      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.OK,
      data: {
        skip,
        limit,
        totalItems: result.totalItems,
        items: presenters.presentFilms(result.items)
      }
    };
  }
}

export default FilmsResource;
