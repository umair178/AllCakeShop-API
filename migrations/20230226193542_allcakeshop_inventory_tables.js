
exports.up = function (knex) {
    return knex.schema
        .createTable('cakes', (table) => {
            table.increments('cake_id').primary();
            table.string('occasion').notNullable();
            table.string('image_url').notNullable();
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('users', (table) => {
            table.increments('user_id').primary();
            table.integer('github_id').notNullable();
            table.string('avatar_url').notNullable();
            table.string('username').notNullable();
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('cart', (table) => {
            table.increments('order_id').primary();
            table.integer('user_id').notNullable();
            table.integer('cake_id').unsigned().notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table
                .foreign('cake_id')
                .references('cake_id')
                .inTable('cakes')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
                
        });
};


exports.down = function(knex) {
    return knex.schema.dropTable('categories').dropTable('users').dropTable('cart');
};
