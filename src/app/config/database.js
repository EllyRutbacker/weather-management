const { Sequelize } = require('sequelize');
require('dotenv').config();

const { 
    POSTGRES_USER, 
    POSTGRES_HOST, 
    POSTGRES_PORT, 
    POSTGRES_DB, 
    POSTGRES_PASSWORD
  } = process.env;

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  dialect: 'postgres',
});

module.exports = sequelize;