exports.up = function (knex) {
  return knex.schema.createTable('movies', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNull();
    table.text('plot').notNull();

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('movies');
};
