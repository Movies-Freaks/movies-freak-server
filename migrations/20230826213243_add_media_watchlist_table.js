/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('media_watchlists', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('watchlist_id').notNull();
    table.uuid('movie_id');
    table.uuid('tv_episode_id');
    table.integer('index');
    table.boolean('watched').defaultTo(false);

    table.foreign('watchlist_id').references('watchlists.id').onDelete('CASCADE');
    table.foreign('movie_id').references('movies.id').onDelete('CASCADE');
    table.foreign('tv_episode_id').references('tv_episodes.id').onDelete('CASCADE');
    table.unique(['watchlist_id', 'movie_id', 'tv_episode_id']);

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('media_watchlists');
};
