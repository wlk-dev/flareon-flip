const { Score } = require('../models');

const userScore = [
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

const seedScore = () => Score.bulkCreate(userScore);

module.exports = seedScore;
