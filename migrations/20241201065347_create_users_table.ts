import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable;
    table.string('username').notNullable();
    table.string('first_last_name').notNullable();
    table.string('second_last_name').nullable();
    table.string('email').notNullable();
    table.date('birthdate');
    table.string('password_hash').notNullable();
    table.string('password_salt').notNullable();

    table.unique('username');
    table.unique('email');

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
