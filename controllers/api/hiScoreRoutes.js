const router = require('express').Router();
const { HiScore, User, Score } = require('../../models');

router.post('/submit', async (req, res) => {
  try {
    const user_id = req.session.user_id

    let user = await User.findByPk(user_id, {
      include : {
        model : Score,
        attributes : ['score']
      }
    });

    let name = user.get({plain : true}).name
    let hiScore = Math.max(...user.Scores.map( score => score.get({plain : true}).score))
    
    console.log(user_id, name, hiScore)

    const scoresInput = await HiScore.create({user_id, name, score : hiScore});
    res.status(200).json(scoresInput)
  } catch (err) {
    console.trace(err)
    res.status(400).json(err);
  }
});

module.exports = router;
