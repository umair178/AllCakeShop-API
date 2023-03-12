const cart_data = require('../seed_data/cart');

exports.seed = function(knex){
    return knex('cart')
    .del()
    .then(()=>{
        return knex('cart').insert(cart_data);
    })
};