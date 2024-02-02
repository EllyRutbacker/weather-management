require('dotenv').config();

const sequelize = require('./config/database');
const WeatherCondition = require('./entities/WeatherCondition');

// Sync the model with the database
sequelize.sync({ force: false })
  .then(() => console.log('Database tables synchronized.'))
  .catch(error => console.error('Error synchronizing tables:', error));

// Function to create a new weather condition
async function createWeatherCondition(adjective) {
  try {
    const newWeatherCondition = await WeatherCondition.create({ adjective });
    return newWeatherCondition.toJSON();
  } catch (error) {
    console.error('Error creating WeatherCondition:', error);
    throw error;
  }
}

// Function to get all weather conditions
async function getAllWeatherConditions() {
  try {
    const weatherConditions = await WeatherCondition.findAll();
    return weatherConditions.map(condition => condition.toJSON());
  } catch (error) {
    console.error('Error getting all WeatherConditions:', error);
    throw error;
  }
}

// Function to get a weather condition by ID
async function getWeatherConditionById(id) {
  try {
    const condition = await WeatherCondition.findByPk(id);
    return condition ? condition.toJSON() : null;
  } catch (error) {
    console.error('Error getting WeatherCondition by ID:', error);
    throw error;
  }
}

// Function to update a weather condition by ID
async function updateWeatherConditionById(id, adjective) {
  try {
    const [numUpdated, updatedCondition] = await WeatherCondition.update(
      { adjective },
      { where: { id }, returning: true }
    );
    return numUpdated > 0 ? updatedCondition[0].toJSON() : null;
  } catch (error) {
    console.error('Error updating WeatherCondition by ID:', error);
    throw error;
  }
}

// Function to delete a weather condition by ID
async function deleteWeatherConditionById(id) {
  try {
    const deletedCondition = await WeatherCondition.destroy({ where: { id }, returning: true });
    return deletedCondition.length > 0 ? deletedCondition[0].toJSON() : null;
  } catch (error) {
    console.error('Error deleting WeatherCondition by ID:', error);
    throw error;
  }
}

module.exports = {
  createWeatherCondition,
  getAllWeatherConditions,
  getWeatherConditionById,
  updateWeatherConditionById,
  deleteWeatherConditionById,
};