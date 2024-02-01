const { createConnection } = require('typeorm');
const fs = require('fs').promises;
const path = require('path');

async function checkDatabaseExists(connectionOptions) {
  try {
    const connection = await createConnection(connectionOptions);

    const queryRunner = connection.createQueryRunner();

    const databaseExists = await queryRunner.query(
      await fs.readFile(path.join(__dirname, 'sql', 'check-database-exists.sql'), 'utf-8'),
      [connectionOptions.database]
    );

    await queryRunner.release();
    await connection.close();

    return databaseExists.length > 0;
  } catch (error) {
    console.error('Error checking database existence:', error);
    return false;
  }
}

async function createDatabaseIfNotExists(connectionOptions) {
  try {
    const connection = await createConnection(connectionOptions);

    const databaseExists = await checkDatabaseExists(connectionOptions);
    if (!databaseExists) {
      const createDatabaseScript = await fs.readFile(path.join(__dirname, 'sql', 'create-database.sql'), 'utf-8');
      await connection.query(createDatabaseScript, { databaseName: connectionOptions.database });

      console.log(`Database "${connectionOptions.database}" created successfully`);
    } else {
      console.log(`Database "${connectionOptions.database}" already exists. Skipping creation.`);
    }

    await connection.close();
    return databaseExists;
  } catch (error) {
    console.error('Error creating database:', error);
    return false;
  }
}

async function createTableSchema(connectionOptions) {
  try {
    const connection = await createConnection(connectionOptions);

    const createTableSchemaScript = await fs.readFile(path.join(__dirname, 'sql', 'create-table-schema.sql'), 'utf-8');
    
    await connection.query(createTableSchemaScript);
      
    console.log('Table schema created successfully');

    await connection.close();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

async function fillDatabase(connectionOptions) {
  try {
    const connection = await createConnection(connectionOptions);

    const initializeTableScript = await fs.readFile(path.join(__dirname, 'sql', 'fill-database.sql'), 'utf-8');
    await connection.query(initializeTableScript);

      console.log('Database initialization complete successfuly.');

    await connection.close();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

async function createAndPopulateDatabase(connectionOptions) {
  const databaseExists = await createDatabaseIfNotExists(connectionOptions);

  if (databaseExists) {
    console.log('Database exists. Synchronizing...');
    
    const connection = await createConnection(connectionOptions);
    await connection.synchronize(true);
    
    console.log('Synchronization complete.');
    
    await createTableSchema(connectionOptions);
    await fillDatabase(connectionOptions);
  } else {
    console.error('Failed to create and initialize the database.');
  }
}

module.exports = { checkDatabaseExists, createAndPopulateDatabase };