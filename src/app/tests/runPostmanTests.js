require('dotenv').config();
const { createAndPopulateDatabase } = require('./initdb/initdb');
const { sendTestRequestToPostmanAPI } = require('./tests/postmanTests');

const { 
  TEST_POSTGRES_USER, 
  TEST_POSTGRES_HOST, 
  TEST_POSTGRES_DB, 
  TEST_POSTGRES_PASSWORD, 
  TEST_POSTGRES_PORT, 
  TEST_URL, 
  POSTMAN_API_KEY 
} = process.env;

// Create connection options for a test DB
const testConnectionOptions = {
  type: 'postgres',
  host: TEST_POSTGRES_HOST,
  port: TEST_POSTGRES_PORT,
  username: TEST_POSTGRES_USER,
  password: TEST_POSTGRES_PASSWORD,
  database: TEST_POSTGRES_DB,
  synchronize: true,
  logging: true,
  entities: ['src/app/entities/**/*.js'],
};

// Call function to create and initalize test database
createAndPopulateDatabase(testConnectionOptions);

console.log('POSTMAN_API_KEY is: ', POSTMAN_API_KEY);

// Call function to send a test request to Postman API
if (POSTMAN_API_KEY) {
    sendTestRequestToPostmanAPI(POSTMAN_API_KEY)
        .then((response) => {
            console.log('Test request to Postman API successful. Response:', response);
        })
        .catch((error) => {
            console.error('Error sending test request to Postman API:', error);
        });
} else {
    console.error('POSTMAN_API_KEY is not set in the environment variables.');
}

const fs = require('fs');
const path = require('path');
const newman = require('newman');

// Read postman tests from json
const tests = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'postmanTests.json'), 'utf-8'));

// Run postman tests using library newman
newman.run({
  collection: tests,
  environment: {
    base_url: TEST_URL,
    POSTMAN_API_KEY: POSTMAN_API_KEY,
    weather_id: '3'
  },
  reporters: 'cli'
}, function (err) {
  if (err) {
    console.error('Postman tests failed:', err);
    process.exit(1);
  } else {
    console.log('Postman tests completed successfully.');
  }
});