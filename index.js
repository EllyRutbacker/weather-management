require('dotenv').config();
const { createAndPopulateDatabase } = require('/src/app/initdb/initdb');

const { 
  POSTGRES_USER, 
  POSTGRES_HOST, 
  POSTGRES_DB, 
  POSTGRES_PASSWORD, 
  POSTGRES_PORT 
} = process.env;

// Create connection options for DB
const connectionOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: true,
  logging: true,
  entities: ['src/app/entities/**/*.js'],
};

// Call function to create and initialize DB
createAndPopulateDatabase(connectionOptions);

const http = require('http');
const weatherRouter = require('/src/app/weatherRouter');

// Create server and turn on router to handle requests
const server = http.createServer(weatherRouter);