import Entity from './entity';

export default class Film extends Entity {
  constructor({
    id,
    name,
    plot,
    title,
    year,
    rated,
    runtime,
    director,
    poster,
    production,
    genre,
    writers,
    actors,
    imdbId,
    imdbRating,
    createdAt,
    updatedAt
  }) {
    super(id, createdAt, updatedAt);

    this.name = name;
    this.plot = plot;
    this.title = title;
    this.year = year;
    this.rated = rated;
    this.runtime = runtime;
    this.director = director;
    this.poster = poster;
    this.production = production;
    this.genre = genre;
    this.writers = writers;
    this.actors = actors;
    this.imdbId = imdbId;
    this.imdbRating = imdbRating;
  }
}
