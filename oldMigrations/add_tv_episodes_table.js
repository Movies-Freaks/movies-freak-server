/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('tv_episodes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('imdb_id').unique();
    table.string('name').notNull();
    table.integer('year');
    table.integer('season_number').notNull();
    table.integer('episode_number').notNull();
    table.string('genre');
    table.string('director');
    table.string('writers');
    table.string('actors');
    table.text('plot');
    table.string('languages');
    table.string('country');
    table.string('poster');
    table.string('awards');
    table.string('imdb_rating');
    table.date('released_at');
    table.uuid('tv_serie_id').notNull();
    table.uuid('tv_season_id').notNull();

    table.foreign('tv_serie_id').references('tv_series.id').onDelete('CASCADE');
    table.foreign('tv_season_id').references('tv_seasons.id').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('tv_episodes');
};
