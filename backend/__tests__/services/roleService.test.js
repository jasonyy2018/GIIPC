/**
 * Unit Tests for Role Service
 * Tests permission checking and caching functionality
 */

import {
  getPermissionsForRole,
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  clearRoleCache,
  clearAllCache,
  getRole,
  getRoleByRoleName,
  listAllRoles,
  listAllPermissions,
  getCacheStats
} from '../../src/services/roleService.js';
import * as roleRepository from '../../src/repositories/roleRepository.js';

// Mock the roleRepository
jest.mock('../../src/repositories/roleRepository.js');

describe('RoleService', () => {
  beforeEach(() => {
    clearAllCache();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPermissionsForRole', () => {
    test('should fetch permissions from database on first call', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' },
        { id: 2, name: 'write:news', description: 'Write news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      const result = await getPermissionsForRole(2);

      expect(roleRepository.getRolePermissions).toHaveBeenCalledWith(2);
      expect(result).toEqual(mockPermissions);
    });

    test('should return cached permissions on subsequent calls', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      // First call - should hit database
      await getPermissionsForRole(2);
      expect(roleRepository.getRolePermissions).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const result = await getPermissionsForRole(2);
      expect(roleRepository.getRolePermissions).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPermissions);
    });

    test('should refresh cache after TTL expires', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      // First call
      await getPermissionsForRole(2);
      expect(roleRepository.getRolePermissions).toHaveBeenCalledTimes(1);

      // Clear cache to simulate TTL expiration
      clearRoleCache(2);

      // Second call after cache clear
      await getPermissionsForRole(2);
      expect(roleRepository.getRolePermissions).toHaveBeenCalledTimes(2);
    });
  });

  describe('checkPermission', () => {
    test('should return true when user has the permission', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' },
        { id: 2, name: 'write:news', description: 'Write news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      const result = await checkPermission(2, 'read:news');

      expect(result).toBe(true);
    });

    test('should return false when user does not have the permission', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      const result = await checkPermission(2, 'delete:news');

      expect(result).toBe(false);
    });

    test('should return false when user has no permissions', async () => {
      roleRepository.getRolePermissions.mockResolvedValue([]);

      const result = await checkPermission(2, 'read:news');

      expect(result).toBe(false);
    });
  });

  describe('checkAnyPermission', () => {
    test('should return true when user has at least one permission', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      const result = await checkAnyPermission(2, ['read:news', 'write:news', 'delete:news']);

      expect(result).toBe(true);
    });

    test('should return false when user has none of the permissions', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      const result = await checkAnyPermission(2, ['write:news', 'delete:news']);

      expect(result).toBe(false);
    });

    test('should return true when user has all requested permissions', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' },
        { id: 2, name: 'write:news', description: 'Write news' },
        { id: 3, name: 'delete:news', description: 'Delete news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      const result = await checkAnyPermission(2, ['read:news', 'write:news']);

      expect(result).toBe(true);
    });

    test('should return false when checking empty permission array', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      const result = await checkAnyPermission(2, []);

      expect(result).toBe(false);
    });
  });

  describe('checkAllPermissions', () => {
    test('should return true when user has all required permissions', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' },
        { id: 2, name: 'write:news', description: 'Write news' },
        { id: 3, name: 'delete:news', description: 'Delete news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      const result = await checkAllPermissions(2, ['read:news', 'write:news']);

      expect(result).toBe(true);
    });

    test('should return false when user is missing at least one permission', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      const result = await checkAllPermissions(2, ['read:news', 'write:news']);

      expect(result).toBe(false);
    });

    test('should return false when user has none of the permissions', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:events', description: 'Read events' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      const result = await checkAllPermissions(2, ['read:news', 'write:news']);

      expect(result).toBe(false);
    });

    test('should return true when checking empty permission array', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      const result = await checkAllPermissions(2, []);

      expect(result).toBe(true);
    });
  });

  describe('Cache Management', () => {
    test('clearRoleCache should clear cache for specific role', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      // Populate cache
      await getPermissionsForRole(2);
      expect(roleRepository.getRolePermissions).toHaveBeenCalledTimes(1);

      // Clear cache for role 2
      clearRoleCache(2);

      // Should fetch from database again
      await getPermissionsForRole(2);
      expect(roleRepository.getRolePermissions).toHaveBeenCalledTimes(2);
    });

    test('clearAllCache should clear all cached permissions', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      // Populate cache for multiple roles
      await getPermissionsForRole(1);
      await getPermissionsForRole(2);
      await getPermissionsForRole(3);
      expect(roleRepository.getRolePermissions).toHaveBeenCalledTimes(3);

      // Clear all cache
      clearAllCache();

      // Should fetch from database again for all roles
      await getPermissionsForRole(1);
      await getPermissionsForRole(2);
      expect(roleRepository.getRolePermissions).toHaveBeenCalledTimes(5);
    });

    test('getCacheStats should return cache information', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' }
      ];

      roleRepository.getRolePermissions.mockResolvedValue(mockPermissions);

      // Populate cache
      await getPermissionsForRole(1);
      await getPermissionsForRole(2);

      const stats = getCacheStats();

      expect(stats).toHaveProperty('size', 2);
      expect(stats).toHaveProperty('entries');
      expect(stats.entries).toContain(1);
      expect(stats.entries).toContain(2);
      expect(stats).toHaveProperty('ttl');
    });
  });

  describe('Role Information', () => {
    test('getRole should return role by ID', async () => {
      const mockRole = {
        id: 1,
        name: 'admin',
        description: 'Administrator role'
      };

      roleRepository.getRoleById.mockResolvedValue(mockRole);

      const result = await getRole(1);

      expect(roleRepository.getRoleById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockRole);
    });

    test('getRoleByRoleName should return role by name', async () => {
      const mockRole = {
        id: 2,
        name: 'editor',
        description: 'Editor role'
      };

      roleRepository.getRoleByName.mockResolvedValue(mockRole);

      const result = await getRoleByRoleName('editor');

      expect(roleRepository.getRoleByName).toHaveBeenCalledWith('editor');
      expect(result).toEqual(mockRole);
    });

    test('listAllRoles should return all roles', async () => {
      const mockRoles = [
        { id: 1, name: 'admin', description: 'Admin' },
        { id: 2, name: 'editor', description: 'Editor' },
        { id: 3, name: 'user', description: 'User' }
      ];

      roleRepository.getAllRoles.mockResolvedValue(mockRoles);

      const result = await listAllRoles();

      expect(roleRepository.getAllRoles).toHaveBeenCalled();
      expect(result).toEqual(mockRoles);
    });

    test('listAllPermissions should return all permissions', async () => {
      const mockPermissions = [
        { id: 1, name: 'read:news', description: 'Read news' },
        { id: 2, name: 'write:news', description: 'Write news' }
      ];

      roleRepository.getAllPermissions.mockResolvedValue(mockPermissions);

      const result = await listAllPermissions();

      expect(roleRepository.getAllPermissions).toHaveBeenCalled();
      expect(result).toEqual(mockPermissions);
    });
  });
});
