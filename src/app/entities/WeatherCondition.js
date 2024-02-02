const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WeatherCondition = sequelize.define('WeatherCondition', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  adjective: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = WeatherCondition;