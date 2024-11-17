exports.up = function (knex) {
  return knex.schema.createTable('tv_seasons', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('tv_serie_id').notNull();
    table.integer('season_number').notNull();
    table.string('plot');
    table.string('poster');
    table.date('released_at');

    table.foreign('tv_serie_id').references('tv_series.id').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tv_seasons');
};
