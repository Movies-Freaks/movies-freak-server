import SQLTestCase from '../testHelper';

import Serializer, { SerializerError } from '../../../database/stores/sql/serializer';
import { Film } from '../../../app/moviesFreak/entities';
import { FilmNotFound, IMDBIdAlreadyExists } from '../../../database/stores/errors';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { UUID } from '../../../types/common';

class FilmsStoreTest extends SQLTestCase {
  setUp() {
    super.setUp();

    this.database = this.getDatabase();
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class FindTest extends FilmsStoreTest {
  async testFindAllFilms() {
    await this.createFilms(this.getDatabase(), 5);

    const { totalItems, items: films } = await this.getDatabase()
      .films
      .find();

    this.assertThat(films).hasLengthOf(5);
    this.assertThat(totalItems).isEqual(5);
    films.forEach((film) => this.assertThat(film).isInstanceOf(Film));
  }

  async testFindWithSkip() {
    await this.createFilms(
      this.getDatabase(),
      [
        { name: 'Midsomar' },
        { name: 'Nimona' },
        { name: '10 Things I Hate about You' },
        { name: 'The Perks of Being a Wallflower' },
        { name: 'Predestination' }
      ]
    );

    const { totalItems, items: films } = await this.getDatabase()
      .films
      .find({ skip: 2 });

    this.assertThat(films).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(films[0].name).isEqual('10 Things I Hate about You');
    this.assertThat(films[1].name).isEqual('The Perks of Being a Wallflower');
    this.assertThat(films[2].name).isEqual('Predestination');
  }

  async testFindWithLimit() {
    await this.createFilms(
      this.getDatabase(),
      [
        { name: 'Midsomar' },
        { name: 'Nimona' },
        { name: '10 Things I Hate about You' },
        { name: 'The Perks of Being a Wallflower' },
        { name: 'Predestination' }
      ]
    );

    const { totalItems, items: films } = await this.getDatabase()
      .films
      .find({ limit: 3 });

    this.assertThat(films).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(films[0].name).isEqual('Midsomar');
    this.assertThat(films[1].name).isEqual('Nimona');
    this.assertThat(films[2].name).isEqual('10 Things I Hate about You');
  }

  async testFindWithSkipAndLimit() {
    await this.createFilms(
      this.getDatabase(),
      [
        { name: 'Midsomar' },
        { name: 'Nimona' },
        { name: '10 Things I Hate about You' },
        { name: 'The Perks of Being a Wallflower' },
        { name: 'Predestination' }
      ]
    );

    const { totalItems, items: films } = await this.getDatabase()
      .films
      .find({ limit: 2, skip: 1 });

    this.assertThat(films).hasLengthOf(2);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(films[0].name).isEqual('Nimona');
    this.assertThat(films[1].name).isEqual('10 Things I Hate about You');
  }

  async testReturnEmptyListWhenThereIsNotFilms() {
    const { totalItems, items: films } = await this.getDatabase()
      .films
      .find();

    this.assertThat(films).isEmpty();
    this.assertThat(totalItems).isEqual(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this.getDatabase().films, 'connection')
      .throws(new SerializerError());

    await this.assertThat(
      this.getDatabase()
        .films
        .find()
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
