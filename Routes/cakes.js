const express = require('express');
const router = express.Router();
const app = express();
const url  = require('url')
const { v4: uuidv4 } = require('uuid');
const categoriesController = require('../controllers/categoriescontroller');
const knex = require('knex')(require('../knexfile'));


app.use('/', (req, _res, next) => {
    console.log(req.url);
    next();
});
// app.use(express.static('./public/images'))
router
.route('/cakes')
.get(categoriesController.index);


router.get('/:cakeId', (req, res) => {
    knex
        .select('*')
        .from('cakes')
        .where('cake_id', req.params.cakeId)
        .then((cake) => {
            res.json(cake)
        })
});
module.exports = router