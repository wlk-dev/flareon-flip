const router = require('express').Router();
const { User, HiScore, Score } = require("../models")
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
  try{
    const leaderData = await HiScore.findAll({
      order: [
        ['score', 'DESC'],
      ]
      
    });
    
    const scores = leaderData.map((score) => score.get({plain: true})) 
    console.log(scores)
    res.render('leaderboard', { 
      scores,
      leaderboardPage : true
      
  });
    } catch (err) {
    res.status(500).json(err);
   }
  
})

router.get('/how-to-play', withAuth, (req, res) => {
  res.render('how-to-play', { userPage : true })
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    const profileData = await User.findByPk(req.session.user_id, {
      include: [
        {
        model: Score,
        attributes: ["score"],
        }
      ]
    })
    console.log(profileData.Scores);
    res.render('profile', { profilePage : true, profileData : profileData.get({plain : true}) });
  } catch(err) {
    res.status(500).json(err)
  };
});

module.exports = router;