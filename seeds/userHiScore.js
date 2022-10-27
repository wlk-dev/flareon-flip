const { HiScore } = require('../models');

const userHiScore = [
  {
    name: 'Sal',
    score: 1000,
  },
  {
    name: 'Lernantino',
    score: 150,
  },
  {
    name: 'Amiko',
    score: 9900,
  },
];

const seedHiScore = () => HiScore.bulkCreate(userHiScore);

module.exports = seedHiScore;