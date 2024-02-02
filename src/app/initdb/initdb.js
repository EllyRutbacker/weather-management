const { Sequelize } = require('sequelize');
const WeatherCondition = require('../entities/WeatherCondition');
const { POSTGRES_USER, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT } = process.env;

async function initializeDatabase() {
  try {

    // Використовуємо додаткове з'єднання без вказаної бази даних
    const sequelizePostgres = new Sequelize({
      database: 'postgres',
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      dialect: 'postgres',
    });

    await sequelizePostgres.authenticate();
    console.log('Connection to the database postgres has been established successfully.');

    // Перевіряємо існування бази даних
    const databaseExists = await sequelizePostgres.queryInterface.sequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${POSTGRES_DB}'`
    );

    if (databaseExists[0].length === 0) {
      console.log(`Database ${POSTGRES_DB} does not exist. Creating...`);
      await sequelizePostgres.queryInterface.createDatabase(POSTGRES_DB);
      console.log(`Database ${POSTGRES_DB} created.`);
    }
    await sequelizePostgres.close();

    // Now connect to weatherdb
    const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      dialect: 'postgres',
    });

    // Check that table exists in the schema
    await sequelize.authenticate();
    console.log(`Connection to the database ${POSTGRES_DB} has been established successfully.`);

    const weatherConditionTableExists = await sequelize.getQueryInterface().showAllTables()
      .then((tables) => tables.includes('WeatherConditions'));

    if (!weatherConditionTableExists) {
      // Sync if not exists
      await sequelize.sync({ force: true });
      console.log('Database tables synchronized.');
    } else {
      console.log('Database tables already exist. Skipping synchronization.');
    }

    // Insert data with ignore duplicates option
    await WeatherCondition.bulkCreate([
      { adjective: 'Sunny' },
      { adjective: 'Cloudy' },
      { adjective: 'Rainy' },
      { adjective: 'Windy' },
      { adjective: 'Foggy' },
      { adjective: 'Snowy' },
      { adjective: 'Stormy' },
      { adjective: 'Clear' },
      { adjective: 'Overcast' },
      { adjective: 'Light fog' },
    ], { ignoreDuplicates: true });

    console.log('Data insertion finished.');
    await sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { initializeDatabase };