const { User } = require('../models');

const userdata = [
  {
    name: 'Sal',
    email: 'sal@hotmail.com',
    password: 'password12345',
  },
  {
    name: 'Lernantino',
    email: 'lernantino@gmail.com',
    password: 'password12345',
  },
  {
    name: 'Amiko',
    email: 'amiko2k20@aol.com',
    password: 'password12345',
  },

  {
    name: 'Max',
    email: 'Maxium@yahoo.com',
    password: 'password12345',
  },

  {
    name: 'Davis',
    email: 'Hi_imDave@gmail.com',
    password: 'password12345',
  },

  {
    name: 'April',
    email: 'SeasonApril@msn.com',
    password: 'password12345',
  },
];

async function seedUser (){
  await User.bulkCreate(userdata)}

module.exports = seedUser;
