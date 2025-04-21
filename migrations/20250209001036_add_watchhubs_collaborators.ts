import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('watch_hubs_collaborators', (table) => {
    table.uuid('collaborator_id').notNullable();
    table.uuid('watch_hub_id').notNullable();
    table.string('type');

    table.unique(['collaborator_id', 'watch_hub_id']);
    table.primary(['collaborator_id', 'watch_hub_id']);

    table.foreign('collaborator_id').references('users.id').onDelete('CASCADE');
    table.foreign('watch_hub_id').references('watch_hubs.id').onDelete('CASCADE');

    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('watch_hubs_collaborators');
}
