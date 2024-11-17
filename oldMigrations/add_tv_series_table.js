/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('tv_series', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('imdb_id').unique();
    table.string('name').notNull();
    table.text('plot');
    table.string('years');
    table.string('rated');
    table.text('genre');
    table.text('writers');
    table.text('actors');
    table.string('poster');
    table.string('imdb_rating');
    table.date('released_at');
    table.integer('total_seasons').notNull();

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('tv_series');
};
