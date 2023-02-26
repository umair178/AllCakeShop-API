const express = require('express');
const router = express.Router();
const app = express();
const fs = require('fs')
const url  = require('url')
const { v4: uuidv4 } = require('uuid');

app.use('/', (req, _res, next) => {
    console.log(req.url);
    next();
});
// app.use(express.static('./public/images'))

router.get('/cakes', (req, res) => {
    console.log(req.url)
        res.json('hello')
    });
module.exports = router