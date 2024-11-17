import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('watchlists', (table) => {
    table.uuid('user_id').notNullable();

    table.foreign('user_id')
      .references('users.id')
      .onDelete('CASCADE');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('watchlists', (table) => {
    table.dropColumn('user_id')
  });
}

