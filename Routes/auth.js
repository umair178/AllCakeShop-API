const express = require('express');
const router = express.Router();
const app = express();
const passport = require('passport');
require('dotenv').config();

router.get('/github', passport.authenticate('github'));
router.get(
    '/github/callback',
    passport.authenticate('github', {
      failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
    }),
    (_req, res) => {
      // Successful authentication, redirect to client-side application
      res.redirect(process.env.CLIENT_URL);
    }
  );
router.get('/profile', (req,res)=>{

  if (req.user===undefined){
    return res.status(401).json({message: 'Unathorized'})
  } else {
    return res.status(200).json(req.user)
    console.log('user object is:', req.user)
  }
});
router.get('/logout', (req,res)=>{
  req.logout((error)=>{
    if (error){
      return res.status(500).json({message: 'Server error, try again later', err:error})
    }
  });
  req.redirect(process.env.CLIENT_URL)
});


  module.exports = router;