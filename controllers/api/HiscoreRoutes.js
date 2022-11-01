const router = require('express').Router();
const { HiScore, User } = require('../../models');

router.post('/submit', async (req, res) => {
  try {
    let name = await User.findByPk(user_id);
    name = name.get({plain : true}).name

    const scoresInput = await HiScore.create({user_id, name, score});
    res.status(200).json(scoresInput)
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;