import { query } from '../config/db.js';

/**
 * Get all permissions for a specific role
 * @param {number} roleId - Role ID
 * @returns {Promise<Array>} Array of permission objects
 */
export async function getRolePermissions(roleId) {
  const sql = `
    SELECT p.id, p.name, p.description
    FROM permissions p
    INNER JOIN role_permissions rp ON p.id = rp.permission_id
    WHERE rp.role_id = $1
    ORDER BY p.name
  `;
  
  const result = await query(sql, [roleId]);
  return result.rows;
}

/**
 * Check if a role has a specific permission
 * @param {number} roleId - Role ID
 * @param {string} permissionName - Permission name (e.g., 'read:news')
 * @returns {Promise<boolean>} True if role has permission
 */
export async function roleHasPermission(roleId, permissionName) {
  const sql = `
    SELECT EXISTS (
      SELECT 1
      FROM role_permissions rp
      INNER JOIN permissions p ON rp.permission_id = p.id
      WHERE rp.role_id = $1 AND p.name = $2
    ) as has_permission
  `;
  
  const result = await query(sql, [roleId, permissionName]);
  return result.rows[0].has_permission;
}

/**
 * Get role by ID
 * @param {number} roleId - Role ID
 * @returns {Promise<Object|null>} Role object or null if not found
 */
export async function getRoleById(roleId) {
  const sql = `
    SELECT id, name, description, created_at
    FROM roles
    WHERE id = $1
  `;
  
  const result = await query(sql, [roleId]);
  return result.rows[0] || null;
}

/**
 * Get role by name
 * @param {string} roleName - Role name
 * @returns {Promise<Object|null>} Role object or null if not found
 */
export async function getRoleByName(roleName) {
  const sql = `
    SELECT id, name, description, created_at
    FROM roles
    WHERE name = $1
  `;
  
  const result = await query(sql, [roleName]);
  return result.rows[0] || null;
}

/**
 * Get all roles
 * @returns {Promise<Array>} Array of all roles
 */
export async function getAllRoles() {
  const sql = `
    SELECT id, name, description, created_at
    FROM roles
    ORDER BY name
  `;
  
  const result = await query(sql);
  return result.rows;
}

/**
 * Get all permissions
 * @returns {Promise<Array>} Array of all permissions
 */
export async function getAllPermissions() {
  const sql = `
    SELECT id, name, description, created_at
    FROM permissions
    ORDER BY name
  `;
  
  const result = await query(sql);
  return result.rows;
}

/**
 * Get permission by ID
 * @param {number} permissionId - Permission ID
 * @returns {Promise<Object|null>} Permission object or null if not found
 */
export async function getPermissionById(permissionId) {
  const sql = `
    SELECT id, name, description, created_at
    FROM permissions
    WHERE id = $1
  `;
  
  const result = await query(sql, [permissionId]);
  return result.rows[0] || null;
}

/**
 * Create a new role
 * @param {string} name - Role name
 * @param {string} description - Role description
 * @returns {Promise<Object>} Created role object
 */
export async function createRole(name, description) {
  const sql = `
    INSERT INTO roles (name, description)
    VALUES ($1, $2)
    RETURNING id, name, description, created_at
  `;
  
  const result = await query(sql, [name, description]);
  return result.rows[0];
}

/**
 * Assign a permission to a role
 * @param {number} roleId - Role ID
 * @param {number} permissionId - Permission ID
 * @returns {Promise<Object>} Created role_permission record
 */
export async function assignPermissionToRole(roleId, permissionId) {
  const sql = `
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES ($1, $2)
    ON CONFLICT (role_id, permission_id) DO NOTHING
    RETURNING role_id, permission_id, created_at
  `;
  
  const result = await query(sql, [roleId, permissionId]);
  return result.rows[0];
}
