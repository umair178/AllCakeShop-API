const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.json());
const cors = require('cors');
app.use(cors());
app.use(express.static('./public/images'))
app.use(express.urlencoded({extended: false}));



app.listen(PORT, ()=>{
    console.log(`listening on http://localhost:${PORT}`)
});