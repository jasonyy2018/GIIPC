import { checkPermission, checkAnyPermission, checkAllPermissions } from '../services/roleService.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';

/**
 * Permission middleware factory - Creates middleware to check for specific permission
 * Verifies that the authenticated user has the required permission
 * 
 * @param {string} requiredPermission - The permission name required (e.g., 'read:news')
 * @returns {Function} Express middleware function
 */
export function permissionGuard(requiredPermission) {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated (authGuard should run first)
      if (!req.user || !req.user.roleId) {
        throw new UnauthorizedError('Authentication required');
      }
      
      const { roleId, role } = req.user;
      
      // Check if user has the required permission
      const hasPermission = await checkPermission(roleId, requiredPermission);
      
      if (!hasPermission) {
        throw new ForbiddenError(`Access denied. Required permission: ${requiredPermission}`);
      }
      
      // User has permission, continue to next middleware
      next();
      
    } catch (error) {
      // Pass error to global error handler
      next(error);
    }
  };
}

/**
 * Permission middleware factory - Checks if user has ANY of the specified permissions
 * User needs at least one of the permissions to proceed
 * 
 * @param {Array<string>} permissions - Array of permission names
 * @returns {Function} Express middleware function
 */
export function anyPermissionGuard(permissions) {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user || !req.user.roleId) {
        throw new UnauthorizedError('Authentication required');
      }
      
      const { roleId } = req.user;
      
      // Check if user has any of the required permissions
      const hasAnyPermission = await checkAnyPermission(roleId, permissions);
      
      if (!hasAnyPermission) {
        throw new ForbiddenError('Access denied. You need at least one of the required permissions');
      }
      
      // User has at least one permission, continue
      next();
      
    } catch (error) {
      // Pass error to global error handler
      next(error);
    }
  };
}

/**
 * Permission middleware factory - Checks if user has ALL of the specified permissions
 * User needs all permissions to proceed
 * 
 * @param {Array<string>} permissions - Array of permission names
 * @returns {Function} Express middleware function
 */
export function allPermissionsGuard(permissions) {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user || !req.user.roleId) {
        throw new UnauthorizedError('Authentication required');
      }
      
      const { roleId } = req.user;
      
      // Check if user has all required permissions
      const hasAllPermissions = await checkAllPermissions(roleId, permissions);
      
      if (!hasAllPermissions) {
        throw new ForbiddenError('Access denied. You need all of the required permissions');
      }
      
      // User has all permissions, continue
      next();
      
    } catch (error) {
      // Pass error to global error handler
      next(error);
    }
  };
}

/**
 * Role-based middleware - Checks if user has a specific role
 * Simpler alternative to permission checking for role-based access
 * 
 * @param {string|Array<string>} allowedRoles - Role name(s) allowed
 * @returns {Function} Express middleware function
 */
export function roleGuard(allowedRoles) {
  // Convert single role to array for consistent handling
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return (req, res, next) => {
    try {
      // Ensure user is authenticated
      if (!req.user || !req.user.role) {
        throw new UnauthorizedError('Authentication required');
      }
      
      const { role } = req.user;
      
      // Check if user's role is in the allowed roles
      if (!roles.includes(role)) {
        throw new ForbiddenError('Access denied. Insufficient role privileges');
      }
      
      // User has required role, continue
      next();
      
    } catch (error) {
      // Pass error to global error handler
      next(error);
    }
  };
}
