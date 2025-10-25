import { query } from '../config/db.js';

/**
 * User Repository
 * Handles all database operations related to users
 */

/**
 * Find a user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null if not found
 */
export async function findUserByEmail(email) {
  const result = await query(
    `SELECT u.id, u.email, u.password, u.role_id, u.created_at, u.updated_at,
            r.name as role_name
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = $1`,
    [email]
  );
  
  return result.rows[0] || null;
}

/**
 * Find a user by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
export async function findUserById(userId) {
  const result = await query(
    `SELECT u.id, u.email, u.role_id, u.created_at, u.updated_at,
            r.name as role_name
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.id = $1`,
    [userId]
  );
  
  return result.rows[0] || null;
}

/**
 * Create a new user
 * @param {string} email - User email
 * @param {string} hashedPassword - Bcrypt hashed password
 * @param {number} roleId - Role ID (defaults to 'user' role)
 * @returns {Promise<Object>} Created user object (without password)
 */
export async function createUser(email, hashedPassword, roleId = null) {
  // If no roleId provided, get the 'user' role ID
  let finalRoleId = roleId;
  
  if (!finalRoleId) {
    const roleResult = await query(
      'SELECT id FROM roles WHERE name = $1',
      ['user']
    );
    
    if (roleResult.rows.length === 0) {
      throw new Error('Default user role not found in database');
    }
    
    finalRoleId = roleResult.rows[0].id;
  }
  
  const result = await query(
    `INSERT INTO users (email, password, role_id)
     VALUES ($1, $2, $3)
     RETURNING id, email, role_id, created_at`,
    [email, hashedPassword, finalRoleId]
  );
  
  return result.rows[0];
}

/**
 * Check if a user exists by email
 * @param {string} email - User email
 * @returns {Promise<boolean>} True if user exists, false otherwise
 */
export async function userExists(email) {
  const result = await query(
    'SELECT 1 FROM users WHERE email = $1',
    [email]
  );
  
  return result.rows.length > 0;
}

/**
 * Update user's last login timestamp (optional enhancement)
 * @param {number} userId - User ID
 * @returns {Promise<void>}
 */
export async function updateLastLogin(userId) {
  await query(
    'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
    [userId]
  );
}

/**
 * Get all users (without passwords)
 * @returns {Promise<Array>} Array of user objects
 */
export async function getAllUsers() {
  const result = await query(
    `SELECT u.id, u.email, u.role_id, u.created_at, u.updated_at,
            r.name as role_name
     FROM users u
     JOIN roles r ON u.role_id = r.id
     ORDER BY u.created_at DESC`
  );
  
  return result.rows;
}

/**
 * Update user's role
 * @param {number} userId - User ID
 * @param {number} roleId - New role ID
 * @returns {Promise<Object>} Updated user object (without password)
 */
export async function updateUserRole(userId, roleId) {
  const result = await query(
    `UPDATE users
     SET role_id = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, email, role_id, created_at, updated_at`,
    [userId, roleId]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0];
}

/**
 * Get user profile with personal information
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} User profile or null
 */
export async function getProfile(userId) {
  const result = await query(
    `SELECT id, email, full_name, phone, organization, position, bio, 
            avatar_url, country, city, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [userId]
  );
  
  return result.rows[0] || null;
}

/**
 * Update user profile information
 * @param {number} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object|null>} Updated profile or null
 */
export async function updateProfile(userId, profileData) {
  const fields = [];
  const values = [];
  let paramCount = 1;
  
  const allowedFields = ['full_name', 'phone', 'organization', 'position', 'bio', 'avatar_url', 'country', 'city'];
  
  allowedFields.forEach(field => {
    if (profileData[field] !== undefined) {
      fields.push(`${field} = $${paramCount}`);
      values.push(profileData[field]);
      paramCount++;
    }
  });
  
  if (fields.length === 0) {
    return await getProfile(userId);
  }
  
  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(userId);
  
  const result = await query(
    `UPDATE users
     SET ${fields.join(', ')}
     WHERE id = $${paramCount}
     RETURNING id, email, full_name, phone, organization, position, bio, 
               avatar_url, country, city, created_at, updated_at`,
    values
  );
  
  return result.rows[0] || null;
}
