import { expect } from 'chai';

import APITestCase from '../../apiTestHelper';
import CreateFilm from '../../../../app/moviesFreak/createFilm';

export default class CreateFilmTest extends APITestCase {
  setUp() {
    super.setUp();

    this._database = this.getDatabase();
    this.buildTestApp(this._database);
  }

  async testCreateFilm() {
    const result = await this.simulatePost({
      path: '/films',
      payload: { imdbId: 'fakeImdbId' }
    });

    expect(result.id).to.exist;
    expect(result.name).to.be.equal('The Shawshank Redemption');
    expect(result.plot).to.be.equal(
      'Over the course of several years, two convicts form a friendship, '
      + 'seeking consolation and, eventually, redemption through basic compassion.'
    );
    expect(result.title).to.be.equal('The Shawshank Redemption');
    expect(result.year).to.be.equal('1994');
    expect(result.rated).to.be.equal('R');
    expect(result.runtime).to.be.equal('142 min');
    expect(result.director).to.be.equal('Frank Darabont');
    expect(result.poster).to.be.equal(
      'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZ'
      + 'DViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg'
    );
    expect(result.production).to.be.equal('N/A');
    expect(result.genre).to.be.deep.equal(['Drama']);
    expect(result.writers).to.be.deep.equal(['Stephen King', 'Frank Darabont']);
    expect(result.actors).to.be.deep.equal(['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']);
    expect(result.imdbId).to.be.equal('tt0111161');
    expect(result.imdbRating).to.be.equal('9.3/10');
  }

  async testReturnsErrorOnUnexpectedError() {
    this.mockClass(CreateFilm, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulatePost({
      path: '/films',
      payload: { imdbId: 'fakeImdbId' },
      statusCode: 500
    });

    expect(result.code).to.be.equal('UNEXPECTED_ERROR');
  }
}