
const cakedata = require('../seed_data/categories');

exports.seed = function (knex){
  return knex('cakes')
  .del()
  .then(function () {
    return knex ('cakes').insert(cakedata);
  })
};