
const cakedata = require('../seed_data/categories');

exports.seed = function (knex){
  return knex('categories')
  .del()
  .then(function () {
    return knex ('categories').insert(cakedata);
  })
};