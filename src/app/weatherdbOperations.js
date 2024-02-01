require('dotenv').config();
const { createConnection } = require('typeorm');

const {
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} = process.env;

// Create connection options for DB
createConnection({
  type: 'postgres',
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: true,
  logging: true,
  entities: ['src/app/entities/*.js'],
})
  .then(async (connection) => {
    // CREATE
    async function createWeatherCondition(adjective) {
      const result = await connection.query(
        'INSERT INTO weather_conditions(adjective) VALUES($1) RETURNING *',
        [adjective]
      );
      return result[0];
    }

    // READ all
    async function getAllWeatherConditions() {
      const result = await connection.query('SELECT * FROM weather_conditions');
      return result;
    }

    // READ by ID
    async function getWeatherConditionById(id) {
      const result = await connection.query('SELECT * FROM weather_conditions WHERE id = $1', [id]);
      return result[0];
    }

    // UPDATE by ID
    async function updateWeatherConditionById(id, adjective) {
      const result = await connection.query(
        'UPDATE weather_conditions SET adjective = $2 WHERE id = $1 RETURNING *',
        [id, adjective]
      );
      return result[0];
    }

    // DELETE by ID
    async function deleteWeatherConditionById(id) {
      const result = await connection.query(
        'DELETE FROM weather_conditions WHERE id = $1 RETURNING *',
        [id]
      );
      return result[0];
    }
    
    module.exports = {
      createWeatherCondition,
      getAllWeatherConditions,
      getWeatherConditionById,
      updateWeatherConditionById,
      deleteWeatherConditionById,
    };
  })
  .catch((error) => console.error('Error creating connection:', error));