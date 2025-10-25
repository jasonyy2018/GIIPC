import express from 'express';
import { getUsers, updateRole, createNewRole, assignPermissions } from '../controllers/adminController.js';
import { authGuard } from '../middleware/authMiddleware.js';
import { roleGuard } from '../middleware/permissionMiddleware.js';
import { 
  validateUpdateUserRole, 
  validateCreateRole, 
  validateAssignPermissions 
} from '../validators/adminValidator.js';

const router = express.Router();

/**
 * Admin Routes
 * All routes require authentication and admin role
 */

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (without passwords)
 * @access  Admin only
 */
router.get('/users', authGuard, roleGuard('admin'), getUsers);

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update a user's role
 * @access  Admin only
 */
router.put('/users/:id/role', authGuard, roleGuard('admin'), validateUpdateUserRole, updateRole);

/**
 * @route   POST /api/admin/roles
 * @desc    Create a new role
 * @access  Admin only
 */
router.post('/roles', authGuard, roleGuard('admin'), validateCreateRole, createNewRole);

/**
 * @route   POST /api/admin/roles/:id/permissions
 * @desc    Assign permissions to a role
 * @access  Admin only
 */
router.post('/roles/:id/permissions', authGuard, roleGuard('admin'), validateAssignPermissions, assignPermissions);

export default router;
