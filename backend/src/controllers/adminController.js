import { getAllUsers, updateUserRole, findUserById } from '../repositories/userRepository.js';
import { 
  getRoleById, 
  getRoleByName, 
  createRole, 
  assignPermissionToRole,
  getPermissionById,
  getRolePermissions
} from '../repositories/roleRepository.js';

/**
 * Get all users (admin only)
 * Returns all users without password information
 * 
 * @route GET /api/admin/users
 * @access Admin only
 */
export async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    
    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch users'
      }
    });
  }
}

/**
 * Update user's role (admin only)
 * Allows admin to change a user's role
 * 
 * @route PUT /api/admin/users/:id/role
 * @access Admin only
 */
export async function updateRole(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const { roleId } = req.body;
    
    // Validate userId
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_USER_ID',
          message: 'Invalid user ID'
        }
      });
    }
    
    // Validate roleId
    if (!roleId || isNaN(roleId) || roleId <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ROLE_ID',
          message: 'Valid role ID is required'
        }
      });
    }
    
    // Check if user exists
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    // Check if role exists
    const role = await getRoleById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ROLE_NOT_FOUND',
          message: 'Role not found'
        }
      });
    }
    
    // Prevent admin from changing their own role
    if (userId === req.user.userId) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'CANNOT_MODIFY_OWN_ROLE',
          message: 'You cannot modify your own role'
        }
      });
    }
    
    // Update user's role
    const updatedUser = await updateUserRole(userId, roleId);
    
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        role_id: updatedUser.role_id,
        role_name: role.name,
        updated_at: updatedUser.updated_at
      }
    });
    
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update user role'
      }
    });
  }
}

/**
 * Create a new role (admin only)
 * Allows admin to create a new role in the system
 * 
 * @route POST /api/admin/roles
 * @access Admin only
 */
export async function createNewRole(req, res) {
  try {
    const { name, description } = req.body;
    
    // Check if role already exists
    const existingRole = await getRoleByName(name);
    if (existingRole) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'ROLE_ALREADY_EXISTS',
          message: `Role '${name}' already exists`
        }
      });
    }
    
    // Create the new role
    const newRole = await createRole(name, description || null);
    
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: newRole
    });
    
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create role'
      }
    });
  }
}

/**
 * Assign permissions to a role (admin only)
 * Allows admin to assign one or more permissions to a role
 * 
 * @route POST /api/admin/roles/:id/permissions
 * @access Admin only
 */
export async function assignPermissions(req, res) {
  try {
    const roleId = parseInt(req.params.id);
    const { permissionIds } = req.body;
    
    // Validate roleId
    if (isNaN(roleId) || roleId <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ROLE_ID',
          message: 'Invalid role ID'
        }
      });
    }
    
    // Check if role exists
    const role = await getRoleById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ROLE_NOT_FOUND',
          message: 'Role not found'
        }
      });
    }
    
    // Validate all permission IDs exist
    const invalidPermissions = [];
    for (const permissionId of permissionIds) {
      const permission = await getPermissionById(permissionId);
      if (!permission) {
        invalidPermissions.push(permissionId);
      }
    }
    
    if (invalidPermissions.length > 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PERMISSIONS_NOT_FOUND',
          message: 'One or more permissions not found',
          details: {
            invalidPermissionIds: invalidPermissions
          }
        }
      });
    }
    
    // Assign permissions to role
    const assignedPermissions = [];
    for (const permissionId of permissionIds) {
      const result = await assignPermissionToRole(roleId, permissionId);
      if (result) {
        assignedPermissions.push(permissionId);
      }
    }
    
    // Get updated role permissions
    const updatedPermissions = await getRolePermissions(roleId);
    
    res.status(200).json({
      success: true,
      message: 'Permissions assigned successfully',
      data: {
        role: {
          id: role.id,
          name: role.name,
          description: role.description
        },
        assignedCount: assignedPermissions.length,
        totalPermissions: updatedPermissions.length,
        permissions: updatedPermissions
      }
    });
    
  } catch (error) {
    console.error('Error assigning permissions:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to assign permissions'
      }
    });
  }
}
