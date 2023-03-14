const express = require('express');
const router = express.Router();
const app = express();
const fs = require('fs')
const url = require('url')
const { v4: uuidv4 } = require('uuid');
const cartController = require('../controllers/cartcontroller');
const knex = require('knex')(require('../knexfile'));

app.use('/', (req, _res, next) => {
    console.log(req.url);
    next();
});
// app.use(express.static('./public/images'))
router
    .route('/cart')
    .get(cartController.index);

router.post('/cart', (req, res) => {
    const { user_id, cake_id } = req.body
    const new_order = {
        user_id,
        cake_id
    }
    res.json(new_order)
    knex('cart')
        .insert({
            user_id: user_id,
            cake_id: cake_id
        })
        .catch((e) => {
            console.log('error inserting cart data in knex is:', e)
        })
});
router.get('/cartdetails', (req, res) => {
    knex.select('cake_id')
        .from('cart')
        .then((rows) => {
            // const cakeIds = rows.map(row => row.cake_id);
            return knex.select('*')
                .from('cakes')
                .whereIn('cake_id', rows);
        })
        .then((cakes) => {
            res.json(cakes);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});




module.exports = router