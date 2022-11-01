const router = require('express').Router();
const { Score, User } = require('../../models');

router.post('/submit', async (req, res) => {
  console.log(req.body)
  try {
    const user_id = req.session.user_id;
    const score = req.body.score;
    let name = await User.findByPk(user_id);
    name = name.get({plain : true}).name

    console.log(user_id, score, name)

    const scoresInput = await Score.create({user_id, name, score});
    res.status(200).json(scoresInput)
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;