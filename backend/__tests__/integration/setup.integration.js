/**
 * Integration Test Setup
 * Configures test database and provides helper functions
 */

import pg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Pool } = pg;

// Test database configuration
const testDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.TEST_DB_NAME || 'giip_test_db',
  user: process.env.DB_USER || 'giip_user',
  password: process.env.DB_PASSWORD || 'giip_secure_password_2025'
};

let testPool;

/**
 * Get test database pool
 */
export function getTestPool() {
  if (!testPool) {
    testPool = new Pool(testDbConfig);
  }
  return testPool;
}

/**
 * Initialize test database schema
 */
export async function initTestDatabase() {
  const pool = getTestPool();
  
  // Drop all tables if they exist
  await pool.query(`
    DROP TABLE IF EXISTS role_permissions CASCADE;
    DROP TABLE IF EXISTS news CASCADE;
    DROP TABLE IF EXISTS events CASCADE;
    DROP TABLE IF EXISTS conferences CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS permissions CASCADE;
    DROP TABLE IF EXISTS roles CASCADE;
  `);
  
  // Create tables
  await pool.query(`
    CREATE TABLE roles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL,
      description TEXT
    );
    
    CREATE TABLE permissions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT
    );
    
    CREATE TABLE role_permissions (
      role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
      permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
      PRIMARY KEY (role_id, permission_id)
    );
    
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role_id INTEGER REFERENCES roles(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE news (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      image_url VARCHAR(500),
      published_date DATE NOT NULL,
      created_by INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL,
      location VARCHAR(255) NOT NULL,
      capacity INTEGER,
      created_by INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE conferences (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      date_range VARCHAR(100) NOT NULL,
      location VARCHAR(255) NOT NULL,
      summary TEXT,
      created_by INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

/**
 * Seed test database with roles and permissions
 */
export async function seedTestDatabase() {
  const pool = getTestPool();
  
  // Insert roles
  await pool.query(`
    INSERT INTO roles (name, description) VALUES
    ('admin', 'Administrator with full access'),
    ('editor', 'Content editor with write access'),
    ('user', 'Regular user with read access')
  `);
  
  // Insert permissions
  await pool.query(`
    INSERT INTO permissions (name, description) VALUES
    ('read:news', 'Read news articles'),
    ('write:news', 'Create news articles'),
    ('edit:news', 'Edit any news article'),
    ('delete:news', 'Delete news articles'),
    ('read:events', 'Read events'),
    ('write:events', 'Create events'),
    ('edit:events', 'Edit any event'),
    ('delete:events', 'Delete events'),
    ('read:conferences', 'Read conferences'),
    ('write:conferences', 'Create conferences'),
    ('edit:conferences', 'Edit any conference'),
    ('delete:conferences', 'Delete conferences'),
    ('manage:users', 'Manage users'),
    ('manage:roles', 'Manage roles and permissions')
  `);
  
  // Get role and permission IDs
  const rolesResult = await pool.query('SELECT id, name FROM roles');
  const permissionsResult = await pool.query('SELECT id, name FROM permissions');
  
  const roles = {};
  rolesResult.rows.forEach(row => {
    roles[row.name] = row.id;
  });
  
  const permissions = {};
  permissionsResult.rows.forEach(row => {
    permissions[row.name] = row.id;
  });
  
  // Assign permissions to admin role
  const adminPermissions = [
    'read:news', 'write:news', 'edit:news', 'delete:news',
    'read:events', 'write:events', 'edit:events', 'delete:events',
    'read:conferences', 'write:conferences', 'edit:conferences', 'delete:conferences',
    'manage:users', 'manage:roles'
  ];
  
  for (const perm of adminPermissions) {
    await pool.query(
      'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
      [roles.admin, permissions[perm]]
    );
  }
  
  // Assign permissions to editor role
  const editorPermissions = [
    'read:news', 'write:news', 'edit:news',
    'read:events', 'write:events', 'edit:events',
    'read:conferences', 'write:conferences', 'edit:conferences'
  ];
  
  for (const perm of editorPermissions) {
    await pool.query(
      'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
      [roles.editor, permissions[perm]]
    );
  }
  
  // Assign permissions to user role
  const userPermissions = ['read:news', 'read:events', 'read:conferences'];
  
  for (const perm of userPermissions) {
    await pool.query(
      'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
      [roles.user, permissions[perm]]
    );
  }
}

/**
 * Create test user
 */
export async function createTestUser(email, password, roleName = 'user') {
  const pool = getTestPool();
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const roleResult = await pool.query(
    'SELECT id FROM roles WHERE name = $1',
    [roleName]
  );
  
  const result = await pool.query(
    'INSERT INTO users (email, password, role_id) VALUES ($1, $2, $3) RETURNING id, email, role_id',
    [email, hashedPassword, roleResult.rows[0].id]
  );
  
  return result.rows[0];
}

/**
 * Generate JWT token for test user
 */
export function generateTestToken(userId, email, roleId) {
  return jwt.sign(
    { userId, email, roleId },
    process.env.JWT_SECRET || 'test_secret_key',
    { expiresIn: '1h' }
  );
}

/**
 * Clean all data from tables
 */
export async function cleanTestDatabase() {
  const pool = getTestPool();
  
  // Delete in correct order to respect foreign key constraints
  await pool.query('TRUNCATE TABLE role_permissions, news, events, conferences, users, permissions, roles RESTART IDENTITY CASCADE');
}

/**
 * Close test database connection
 */
export async function closeTestDatabase() {
  if (testPool) {
    await testPool.end();
    testPool = null;
  }
}
