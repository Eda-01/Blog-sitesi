export async function up(knex) {
    await knex.schema.createTable('comments', (table) => {
        table.increments('id').primary();
        table.text('content').notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.integer('post_id').unsigned().references('id').inTable('post').onDelete('CASCADE');
        table.string('commenter_name').notNullable();
    });

}

export async function down(knex) {
   await knex.schema.dropTable('comments');
}