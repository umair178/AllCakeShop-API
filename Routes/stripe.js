const express = require('express');
const router = express.Router();
const app = express();
const url = require('url')
const { v4: uuidv4 } = require('uuid');
const knex = require('knex')(require('../knexfile'));
require('dotenv').config();


app.use('/', (req, _res, next) => {
    console.log(req.url)
    next();
});
const stripesecretkey = process.env.STRIPE_PRIVATE_KEY
const stripe = require('stripe')(stripesecretkey);
const client_url = process.env.CLIENT_URL;
const storeItems = new Map([
    [1, { priceInCents: 10000, name: "shirt" }],
    [2, { priceInCents: 20000, name: "jeans" }],
]);
console.log('storeItems:', storeItems)

router.post('/create-checkout-session', (req, res)=>{
    const {items} = req.body
    console.log(items)
    if (items.length === 0) {
        return res.status(400).send('No items in cart.')
    }
    const session = stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: items.map((item)=>{
            const storeItem = storeItems.get(item.id)
            console.log(`item.id: ${item.id}, storeItem:`, storeItem)
            return(
                {
                    price_data:{
                    currency: 'usd',
                    product_data:{name: storeItem.name},
                    unit_amount: storeItem.priceInCents,
                    }, 
                    quantity: item.quantity,
                }
            )
        }),
        success_url: `${client_url}?success=true`,
        cancel_url: `${client_url}?canceled=true`,
    })
    .then(session=>{
        res.json({url: session.url});
    })
    .catch(e=>{
        console.log('error creating checkout session is:', e);
        res.status(500).send('Error creating checkout session');
    })

});

module.exports = router;