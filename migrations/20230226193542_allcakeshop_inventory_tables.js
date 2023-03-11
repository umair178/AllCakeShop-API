
exports.up = function(knex) {
    return knex.schema
    .createTable('categories', (table)=>{
        table.increments('id').primary();
        table.string('occasion').notNullable();
        table.string('image_url').notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('users',(table)=>{
        table.increments('id').primary();
        table.integer('github_id').notNullable();
        table.string('avatar_url').notNullable();
        table.string('username').notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};


exports.down = function(knex) {
    return knex.schema.dropTable('categories').dropTable('users');
};
