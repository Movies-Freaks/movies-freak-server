import Entity from './entity';
import { Json, UUID } from '../../../types/common';

class TVEpisode extends Entity {
  imdbId: string;
  name: string;
  year: number;
  seasonNumber: number;
  episodeNumber: number;
  genre: string[];
  director: string;
  writers: string[];
  actors: string[];
  plot: string;
  languages: string[];
  country: string;
  poster: string;
  awards: string;
  imdbRating: string;
  releasedAt: Date;

  readonly tvSerieId?: UUID;
  readonly tvSeasonId?: UUID;

  constructor(args: Json) {
    super(args.id, args.createdAt, args.updatedAt);

    this.imdbId = args.imdbId;
    this.name = args.name;
    this.year = args.year;
    this.seasonNumber = args.seasonNumber;
    this.episodeNumber = args.episodeNumber;
    this.genre = args.genre;
    this.director = args.director;
    this.writers = args.writers;
    this.actors = args.actors;
    this.plot = args.plot;
    this.languages = args.languages;
    this.country = args.country;
    this.poster = args.poster;
    this.awards = args.awards;
    this.imdbRating = args.imdbRating;
    this.releasedAt = args.releasedAt;
    this.tvSerieId = args.tvSerieId;
    this.tvSeasonId = args.tvSeasonId;
  }
}

export default TVEpisode;
