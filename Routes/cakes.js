const express = require('express');
const router = express.Router();
const app = express();
const url = require('url')
const { v4: uuidv4 } = require('uuid');
const categoriesController = require('../controllers/categoriescontroller');
const cartController = require('../controllers/cartcontroller');

const knex = require('knex')(require('../knexfile'));


app.use('/', (req, _res, next) => {
    console.log("middleware is running");
    next();
});
// app.use(express.static('./public/images'))
router
    .route('/cakes')
    .get(categoriesController.index);

router.get('/yes', (req, res)=>{
    res.json('hellll')
})


router.get('/:cakeId', (req, res) => {
    console.log(req.url)
    knex
        .select('*')
        .from('cakes')
        .where('cake_id', req.params.cakeId)
        .then((cake) => {
            res.json(cake)
        })
});


module.exports = router