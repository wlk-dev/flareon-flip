const User = require('./User');
const Score = require('./Score');
const HiScore = require('./HiScore');

User.hasMany(Score, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Score.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasOne(HiScore, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

HiScore.belongsTo(User,{
  foreignKey: 'user_id',
})


module.exports = { User, Score, HiScore };