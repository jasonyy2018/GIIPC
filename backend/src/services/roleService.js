import {
  getRolePermissions,
  roleHasPermission,
  getRoleById,
  getRoleByName,
  getAllRoles,
  getAllPermissions
} from '../repositories/roleRepository.js';

/**
 * In-memory cache for role permissions
 * Structure: { roleId: [permission1, permission2, ...] }
 */
const permissionCache = new Map();

/**
 * Cache TTL (Time To Live) in milliseconds
 * Default: 5 minutes
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Cache metadata to track expiration
 * Structure: { roleId: timestamp }
 */
const cacheTimestamps = new Map();

/**
 * Check if cache entry is still valid
 * @param {number} roleId - Role ID
 * @returns {boolean} True if cache is valid
 */
function isCacheValid(roleId) {
  const timestamp = cacheTimestamps.get(roleId);
  if (!timestamp) return false;
  
  const now = Date.now();
  return (now - timestamp) < CACHE_TTL;
}

/**
 * Get permissions for a role (with caching)
 * @param {number} roleId - Role ID
 * @returns {Promise<Array>} Array of permission objects
 */
export async function getPermissionsForRole(roleId) {
  // Check if cache is valid
  if (isCacheValid(roleId)) {
    return permissionCache.get(roleId);
  }
  
  // Fetch from database
  const permissions = await getRolePermissions(roleId);
  
  // Update cache
  permissionCache.set(roleId, permissions);
  cacheTimestamps.set(roleId, Date.now());
  
  return permissions;
}

/**
 * Check if a user has a specific permission
 * @param {number} roleId - User's role ID
 * @param {string} permissionName - Permission name to check
 * @returns {Promise<boolean>} True if user has permission
 */
export async function checkPermission(roleId, permissionName) {
  // Get permissions from cache or database
  const permissions = await getPermissionsForRole(roleId);
  
  // Check if permission exists in the list
  return permissions.some(p => p.name === permissionName);
}

/**
 * Check if a user has any of the specified permissions
 * @param {number} roleId - User's role ID
 * @param {Array<string>} permissionNames - Array of permission names
 * @returns {Promise<boolean>} True if user has at least one permission
 */
export async function checkAnyPermission(roleId, permissionNames) {
  const permissions = await getPermissionsForRole(roleId);
  const permissionSet = new Set(permissions.map(p => p.name));
  
  return permissionNames.some(name => permissionSet.has(name));
}

/**
 * Check if a user has all of the specified permissions
 * @param {number} roleId - User's role ID
 * @param {Array<string>} permissionNames - Array of permission names
 * @returns {Promise<boolean>} True if user has all permissions
 */
export async function checkAllPermissions(roleId, permissionNames) {
  const permissions = await getPermissionsForRole(roleId);
  const permissionSet = new Set(permissions.map(p => p.name));
  
  return permissionNames.every(name => permissionSet.has(name));
}

/**
 * Clear permission cache for a specific role
 * @param {number} roleId - Role ID
 */
export function clearRoleCache(roleId) {
  permissionCache.delete(roleId);
  cacheTimestamps.delete(roleId);
}

/**
 * Clear all permission cache
 */
export function clearAllCache() {
  permissionCache.clear();
  cacheTimestamps.clear();
}

/**
 * Get role information by ID
 * @param {number} roleId - Role ID
 * @returns {Promise<Object|null>} Role object or null
 */
export async function getRole(roleId) {
  return await getRoleById(roleId);
}

/**
 * Get role information by name
 * @param {string} roleName - Role name
 * @returns {Promise<Object|null>} Role object or null
 */
export async function getRoleByRoleName(roleName) {
  return await getRoleByName(roleName);
}

/**
 * Get all available roles
 * @returns {Promise<Array>} Array of all roles
 */
export async function listAllRoles() {
  return await getAllRoles();
}

/**
 * Get all available permissions
 * @returns {Promise<Array>} Array of all permissions
 */
export async function listAllPermissions() {
  return await getAllPermissions();
}

/**
 * Get cache statistics (for monitoring/debugging)
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
  return {
    size: permissionCache.size,
    entries: Array.from(permissionCache.keys()),
    ttl: CACHE_TTL
  };
}
