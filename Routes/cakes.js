const express = require('express');
const router = express.Router();
const app = express();
const url = require('url')
const { v4: uuidv4 } = require('uuid');
const categoriesController = require('../controllers/categoriescontroller');
const cartController = require('../controllers/cartcontroller');
const knex = require('knex')(require('../knexfile'));
const passport = require('passport');


app.use('/', (req, _res, next) => {
    console.log("middleware is running");
    next();
});
// app.use(express.static('./public/images'))
router
    .route('/cakes')
    .get(categoriesController.index);

router.post('/getuserid', (req,res)=>{
    const {user_id} = req.body
    console.log('user id is:',user_id)
    res.json(user_id)
})
router.get('/cart', (req, res) => {
    knex
        .select('*')
        .from('cart')
        .then((cartcakes) => {
            const cakeIds = cartcakes.map((cake) => cake.cake_id)
            return knex
                .select('*')
                .from('cakes')
                .whereIn('cake_id', cakeIds)
        })
        .then((cakes) => {
            res.json(cakes)
        })
        .catch(e => {
            console.log('eror is:', e)
            res.send('internal error')
        })
});
router.get('/:cakeId', (req, res) => {
    knex
        .select('*')
        .from('cakes')
        .where('cake_id', req.params.cakeId)
        .then((cake) => {
            res.json(cake)
        })
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
router.delete('/cart', (req, res) => {
    const { cake } = req.body
    knex('cart')
        .where({ cake_id: cake.cake_id })
        .del()
        .then(cake => {
            res.json(cake)
        })
});



module.exports = router