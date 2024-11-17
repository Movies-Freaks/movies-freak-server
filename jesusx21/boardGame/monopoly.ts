/* eslint-disable no-unused-vars */
import { TitleNotFound, TokenNotUsed } from './errors';
import { Request, Response, Json } from './types';

class Monopoly {
  private titles: Json;

  constructor() {
    this.titles = {};
  }

  async onPost(_request: Request): Promise<Response> {
    throw new TokenNotUsed();
  }

  async onGet(_request: Request): Promise<Response> {
    throw new TokenNotUsed();
  }

  async onPut(_request: Request): Promise<Response> {
    throw new TokenNotUsed();
  }

  async onDelete(_request: Request): Promise<Response> {
    throw new TokenNotUsed();
  }

  /**
   * See title as a dependency, so what setTitle does is to set a dependency to boardgame
   */
  setTitle(titleName: string, titleValue: object) {
    this.titles[titleName] = titleValue;
  }

  /**
   * See titles as a dependency, so what setTitle does is to set a dependency to boardgame
   */
  setTitles(titles: Json) {
    Object.assign(this.titles, { ...titles });
  }

  /**
   * See title as a dependency, so what getTitle does is to get a dependency
   * from the boardgame by its name
   */
  getTitle(titleName: string) {
    const title = this.titles[titleName];

    if (!title) {
      throw new TitleNotFound(titleName);
    }

    return title;
  }

  /**
   * See title as a dependency, so what getTitle does is to get all of the dependencies
   * from the boardgame
   */
  getTitles() {
    return this.titles;
  }
}

export default Monopoly;
