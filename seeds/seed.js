const sequelize = require('../config/connection');

const { User, HiScore, Score } = require("../models");

const seedUser = require('./userData.json');
const seedScore = require('./userScore.json');

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(seedUser, {
    individualHooks : true,
    returning : true,
  });

  for(const score of seedScore) {
    await Score.create({...score})
    await HiScore.create({...score})
  }
  
  process.exit(0);
};

seedAll();