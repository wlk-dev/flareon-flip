const router = require('express').Router();
const userRoutes = require('./userRoutes');
const scoreRoutes = require('./scoreRoutes');
const hiScoreRoutes = require('./hiScoreRoutes');

router.use('/users', userRoutes);
router.use('/scores', scoreRoutes);
router.use('/hi-scores', hiScoreRoutes);

module.exports = router;
