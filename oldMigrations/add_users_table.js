/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNull();
    table.string('username').notNull();
    table.string('last_name').notNull();
    table.string('email').notNull();
    table.date('birthdate');
    table.string('password_hash').notNull();
    table.string('password_salt').notNull();

    table.unique('username');
    table.unique('email');

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
