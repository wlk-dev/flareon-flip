const sequelize = require('../config/connection');
const seedUser = require('./userData.js');
const seedScore = require('./userScore.js');
const seedHiScore = require('./userHiScore.js');

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedUser();

  await seedScore();

  await seedHiScore();
  
  process.exit(0);
};

seedAll();