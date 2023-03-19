const knex = require('knex')(require('../knexfile'));

exports.index = (_req, res) => {
    knex('cart')
        .then((data) => {
            console.log('cart data is', data)
            res.status(200).json(data);
        })
        .catch((err) => res.status(400).send(`Error retrieving cart data is: ${err}`));
};