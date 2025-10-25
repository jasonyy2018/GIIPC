/**
 * Unit Tests for Permission Middleware
 * Tests RBAC permission checking functionality
 */

import {
  permissionGuard,
  anyPermissionGuard,
  allPermissionsGuard,
  roleGuard
} from '../../src/middleware/permissionMiddleware.js';
import * as roleService from '../../src/services/roleService.js';
import { UnauthorizedError, ForbiddenError } from '../../src/utils/errors.js';

// Mock the roleService
jest.mock('../../src/services/roleService.js');

describe('Permission Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {
        userId: 1,
        email: 'test@example.com',
        roleId: 2,
        role: 'user'
      }
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('permissionGuard', () => {
    test('should call next when user has required permission', async () => {
      roleService.checkPermission.mockResolvedValue(true);

      const middleware = permissionGuard('read:news');
      await middleware(req, res, next);

      expect(roleService.checkPermission).toHaveBeenCalledWith(2, 'read:news');
      expect(next).toHaveBeenCalledWith();
    });

    test('should call next with ForbiddenError when user lacks permission', async () => {
      roleService.checkPermission.mockResolvedValue(false);

      const middleware = permissionGuard('write:news');
      await middleware(req, res, next);

      expect(roleService.checkPermission).toHaveBeenCalledWith(2, 'write:news');
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
      expect(next.mock.calls[0][0].message).toContain('write:news');
    });

    test('should call next with UnauthorizedError when user is not authenticated', async () => {
      req.user = null;

      const middleware = permissionGuard('read:news');
      await middleware(req, res, next);

      expect(roleService.checkPermission).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    test('should call next with UnauthorizedError when roleId is missing', async () => {
      req.user = { userId: 1, email: 'test@example.com' };

      const middleware = permissionGuard('read:news');
      await middleware(req, res, next);

      expect(roleService.checkPermission).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    test('should handle service errors', async () => {
      const serviceError = new Error('Database connection failed');
      roleService.checkPermission.mockRejectedValue(serviceError);

      const middleware = permissionGuard('read:news');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(serviceError);
    });
  });

  describe('anyPermissionGuard', () => {
    test('should call next when user has at least one required permission', async () => {
      roleService.checkAnyPermission.mockResolvedValue(true);

      const middleware = anyPermissionGuard(['read:news', 'write:news']);
      await middleware(req, res, next);

      expect(roleService.checkAnyPermission).toHaveBeenCalledWith(2, ['read:news', 'write:news']);
      expect(next).toHaveBeenCalledWith();
    });

    test('should call next with ForbiddenError when user has none of the permissions', async () => {
      roleService.checkAnyPermission.mockResolvedValue(false);

      const middleware = anyPermissionGuard(['write:news', 'delete:news']);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    test('should call next with UnauthorizedError when user is not authenticated', async () => {
      req.user = null;

      const middleware = anyPermissionGuard(['read:news']);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('allPermissionsGuard', () => {
    test('should call next when user has all required permissions', async () => {
      roleService.checkAllPermissions.mockResolvedValue(true);

      const middleware = allPermissionsGuard(['read:news', 'write:news']);
      await middleware(req, res, next);

      expect(roleService.checkAllPermissions).toHaveBeenCalledWith(2, ['read:news', 'write:news']);
      expect(next).toHaveBeenCalledWith();
    });

    test('should call next with ForbiddenError when user lacks any permission', async () => {
      roleService.checkAllPermissions.mockResolvedValue(false);

      const middleware = allPermissionsGuard(['read:news', 'write:news', 'delete:news']);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    test('should call next with UnauthorizedError when user is not authenticated', async () => {
      req.user = null;

      const middleware = allPermissionsGuard(['read:news']);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('roleGuard', () => {
    test('should call next when user has required role (single role)', () => {
      const middleware = roleGuard('user');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    test('should call next when user has one of the required roles (multiple roles)', () => {
      req.user.role = 'editor';

      const middleware = roleGuard(['user', 'editor', 'admin']);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    test('should call next with ForbiddenError when user lacks required role', () => {
      const middleware = roleGuard('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
      expect(next.mock.calls[0][0].message).toContain('role');
    });

    test('should call next with UnauthorizedError when user is not authenticated', () => {
      req.user = null;

      const middleware = roleGuard('user');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    test('should call next with UnauthorizedError when role is missing', () => {
      req.user = { userId: 1, roleId: 2 };

      const middleware = roleGuard('user');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });
});
