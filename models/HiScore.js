const { Model, DataType } = require('sequelize');
const sequelize = require('../config/connection');

class HiScore extends Model {}

HiScore.init(
  {
    id: {
      type: DataType.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    score: {
      type: Datatype.INTEGER,
    },

    name: {
      type: DataType.STRING,
      allowNull: false,
    },

    user_id: {
      type: DataType.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
    },   
  },

  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'HiScore',
  }
);

modeul.exports = HiScore;