
exports.up = function (knex) {
    return knex.schema
        .createTable('cakes', (table) => {
            table.increments('cake_id').primary();
            table.string('occasion').notNullable();
            table.string('image_url').notNullable();
            table.integer('price').notNullable();
            table.string('shipped').defaultTo('No');
            table.string('size').defaultTo('Medium');
            table.string('servings').defaultTo('(8 - 10 Servings)');
            table.string('style').defaultTo('Fresh Floral');
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('users', (table) => {
            table.increments('user_id').primary();
            table.string('github_id', 255).notNullable();
            table.string('avatar_url').notNullable();
            table.string('username').notNullable();
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('cart', (table) => {
            table.increments('order_id').primary();
            table.integer('user_id').notNullable();
            table.integer('cake_id').unsigned().notNullable();
            table.string('shipped').defaultTo('No');
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
    return knex.schema.dropTable('cakes').dropTable('users').dropTable('cart');
};
