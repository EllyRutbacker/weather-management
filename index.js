require('dotenv').config();

const { initializeDatabase } = require('./src/app/initdb/initdb');
const { startServer } = require('./src/app/weatherRouter');

async function runServer() {
  try {
    await initializeDatabase();
    await startServer();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

runServer();