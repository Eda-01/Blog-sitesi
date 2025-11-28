import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.integer('category_id').unsigned().notNullable();
    table.foreign('category_id').references('id').inTable('categories');
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('published_at').nullable();
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('posts');
}

