const express = require('express');
const router = express.Router();
const app = express();
const url = require('url')
const cartController = require('../controllers/cartcontroller');
const knex = require('knex')(require('../knexfile'));

app.use('/', (req, _res, next) => {
    console.log("middle ware is running");
    next();
});

router.get('/cart', (req, res) => {
    console.log(req.url)
    res.json('helloooo')
    
});
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


module.exports = router
// router.get('/cartdetails', (req, res) => {
//     knex.select('cake_id')
//         .from('cart')
//         .then((rows) => {
//             // const cakeIds = rows.map(row => row.cake_id);
//             return knex.select('*')
//                 .from('cakes')
//                 .whereIn('cake_id', rows);
//         })
//         .then((cakes) => {
//             res.json(cakes);
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).send('Internal Server Error');
//         });
// });