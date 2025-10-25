/**
 * Setup Test Database Script
 * Creates a test database for integration tests
 */

import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

const testDbName = process.env.TEST_DB_NAME || 'giip_test_db';
const dbUser = process.env.DB_USER || 'giip_user';
const dbPassword = process.env.DB_PASSWORD || 'giip_secure_password_2025';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

async function setupTestDatabase() {
  // Connect to postgres database to create test database
  const client = new Client({
    host: dbHost,
    port: dbPort,
    database: 'postgres',
    user: dbUser,
    password: dbPassword
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if test database exists
    const checkDb = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [testDbName]
    );

    if (checkDb.rows.length > 0) {
      console.log(`Test database '${testDbName}' already exists`);
      
      // Drop and recreate for clean state
      console.log(`Dropping existing test database...`);
      await client.query(`DROP DATABASE ${testDbName}`);
      console.log(`Creating fresh test database...`);
      await client.query(`CREATE DATABASE ${testDbName}`);
      console.log(`✓ Test database '${testDbName}' recreated successfully`);
    } else {
      // Create test database
      await client.query(`CREATE DATABASE ${testDbName}`);
      console.log(`✓ Test database '${testDbName}' created successfully`);
    }

    console.log('\nTest database is ready for integration tests');
    console.log(`Database: ${testDbName}`);
    console.log(`Host: ${dbHost}:${dbPort}`);
    console.log(`User: ${dbUser}`);

  } catch (error) {
    console.error('Error setting up test database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupTestDatabase();
