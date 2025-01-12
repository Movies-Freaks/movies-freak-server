import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('movies', (table) => {
    table.string('imdb_id').unique();
    table.string('title');
    table.string('year');
    table.string('rated');
    table.string('runtime');
    table.text('genre');
    table.string('director');
    table.text('writers');
    table.text('actors');
    table.string('poster');
    table.string('imdb_rating');
    table.string('production');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('movies', (table) => {
    table.dropColumn('imdb_id');
    table.dropColumn('title');
    table.dropColumn('rated');
    table.dropColumn('runtime');
    table.dropColumn('genre');
    table.dropColumn('director');
    table.dropColumn('writers');
    table.dropColumn('actors');
    table.dropColumn('poster');
    table.dropColumn('imdb_rating');
    table.dropColumn('production');
  });
}