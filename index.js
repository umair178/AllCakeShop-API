const express = require('express');
const app = express();
const PORT = 8080;
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const cakesRoutes = require('./Routes/cakes');

app.use(express.json());
app.use(cors());
app.use(express.static('./Public/images'))
app.use(express.urlencoded({extended: false}));


app.use('/', cakesRoutes);

app.listen(PORT, ()=>{
    console.log(`listening on http://localhost:${PORT}`)
});