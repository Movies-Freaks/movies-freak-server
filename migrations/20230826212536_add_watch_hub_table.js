exports.up = function (knex) {
  return knex.schema.createTable('watch_hubs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNull();
    table.string('description');
    table.text('privacy').notNull();

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('watch_hubs');
};
