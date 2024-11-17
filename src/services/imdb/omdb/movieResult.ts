import OMDBResult from './result';
import { IMDBType } from '../types';

export default class OMDBMovieResult extends OMDBResult {
  constructor(rawResponse: any) {
    super(rawResponse);

    this.type = IMDBType.MOVIE;
  }

  get year() {
    return this.currentResponse.Year;
  }
}
