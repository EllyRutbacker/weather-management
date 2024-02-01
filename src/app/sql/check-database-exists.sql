SELECT EXISTS (
    SELECT 1
    FROM pg_database
    WHERE datname = :databaseName
) AS database_exists;