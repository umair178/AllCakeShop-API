const express = require('express');
const router = express.Router();
const app = express();
const url = require('url')
const { v4: uuidv4 } = require('uuid');
const knex = require('knex')(require('../knexfile'));
require('dotenv').config();


app.use('/', (req, _res, next) => {
    // console.log(req.url)
    next();
});
const stripesecretkey = process.env.STRIPE_PRIVATE_KEY
const stripe = require('stripe')(stripesecretkey);
const client_url = process.env.CLIENT_URL;

const storeItemsPromise = ()=>{
    return knex
    .select('*')
    .from('cart')
    .then(cartcakes => {
        const cakeIds = cartcakes.map((cake) => cake.cake_id)
        console.log('cakeIds are:', cakeIds)
        return knex
            .select('*')
            .from('cakes')
            .whereIn('cake_id', cakeIds)
    })
    .then(cakes => {
        console.log('cakes are:', cakes)
        return (
            cakes.map(cake => {
                return (
                    [cake.cake_id, { priceInCents: cake.price, name: cake.occasion }]
                )
            })
        )

    })
};


router.post('/create-checkout-session', async(req, res)=>{
    const {items} = req.body
    if (items.length === 0) {
        return res.status(400).send('No items in cart.')
    }
    const storeItems = new Map(await storeItemsPromise());
    const session = stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: items.map((item)=>{
            console.log('items array is:', items)
            const storeItem = storeItems.get(item.id)
            console.log('storeItems are:', storeItems)
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
    .then(async(session)=>{
        const cartItemIds = items.map((item) => item.id);
        await knex('cart').whereIn('cake_id', cartItemIds).del();
        res.json({url: session.url});

    })
    
    .catch(e=>{
        console.log('error creating checkout session is:', e);
        res.status(500).send('Error creating checkout session');
    })

});

module.exports = router;