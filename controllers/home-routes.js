const router = require('express').Router();
const { User } = require("../models")
const withAuth = require('../utils/auth');

router.get("/", withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id);
        res.render('menu', { userData : userData.get({plain : true}) })

    } catch(err) {
        res.status(500).json(err)
    }
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }
    
    res.render('signup')
})

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
  });
  

module.exports = router;
