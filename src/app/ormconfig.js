const { 
  POSTGRES_USER, 
  POSTGRES_HOST, 
  POSTGRES_DB, 
  POSTGRES_PASSWORD, 
  POSTGRES_PORT
} = process.env;

module.exports = {
    type: 'postgres',
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    synchronize: 'true',
    logging: 'true',
    entities: ['src/app/entities/*.js'],
    cli: {
      entitiesDir: 'src/app/entities'
    },
  };