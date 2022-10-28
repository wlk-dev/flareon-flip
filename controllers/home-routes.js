const router = require('express').Router();
const { User } = require("../models")
const withAuth = require('../utils/auth');

router.get("/", withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id);
        res.render('menu', { menuPage : true, userData : userData.get({plain : true}) })

    } catch(err) {
        res.status(500).json(err)
    }
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }
    
    res.render('signup', { userPage : true })
})

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('login', { userPage : true });
  });
  
router.get('/leaderboard', withAuth, async (req, res) => {
  try {
    const userScore = await User.findByPk(req.session.user_id);
    res.render('menu', { menuPage : true, userScore : userScore.get({plain : true}) })

  } catch(err) {
    res.status(500).json(err)
  }
  res.render('leaderboard', { leaderboardPage : true });
});
  



router.get('/how-to-play', withAuth, (req, res) => {
  res.render('how-to-play', { h2pPage : true })
})


router.get('/profile', withAuth, (req, res) => {
  res.render('profile', { profilePage : true });
});


module.exports = router;
