import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('watch_hubs', (table) => {
    table.uuid('owner_id').notNullable();

    table.foreign('owner_id')
      .references('users.id')
      .onDelete('CASCADE');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('watch_hubs', (table) => {
    table.dropColumn('owner_id')
  });
}
