import { z } from 'zod';

/**
 * Validation schema for updating user role
 */
export const updateUserRoleSchema = z.object({
  roleId: z.number({
    required_error: 'Role ID is required',
    invalid_type_error: 'Role ID must be a number'
  }).int().positive('Role ID must be a positive integer')
});

/**
 * Middleware to validate update user role request
 */
export function validateUpdateUserRole(req, res, next) {
  try {
    updateUserRoleSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        }
      });
    }
    next(error);
  }
}

/**
 * Validation schema for creating a new role
 */
export const createRoleSchema = z.object({
  name: z.string({
    required_error: 'Role name is required',
    invalid_type_error: 'Role name must be a string'
  })
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must not exceed 50 characters')
    .regex(/^[a-z_]+$/, 'Role name must contain only lowercase letters and underscores'),
  description: z.string({
    invalid_type_error: 'Description must be a string'
  }).optional()
});

/**
 * Middleware to validate create role request
 */
export function validateCreateRole(req, res, next) {
  try {
    createRoleSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        }
      });
    }
    next(error);
  }
}

/**
 * Validation schema for assigning permissions to a role
 */
export const assignPermissionsSchema = z.object({
  permissionIds: z.array(
    z.number({
      required_error: 'Permission ID is required',
      invalid_type_error: 'Permission ID must be a number'
    }).int().positive('Permission ID must be a positive integer'),
    {
      required_error: 'Permission IDs array is required',
      invalid_type_error: 'Permission IDs must be an array'
    }
  ).min(1, 'At least one permission ID is required')
});

/**
 * Middleware to validate assign permissions request
 */
export function validateAssignPermissions(req, res, next) {
  try {
    assignPermissionsSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        }
      });
    }
    next(error);
  }
}
