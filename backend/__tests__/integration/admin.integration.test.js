/**
 * Admin API Integration Tests
 * Tests admin user and role management endpoints
 */

import request from 'supertest';
import app from '../../src/server.js';
import {
  initTestDatabase,
  seedTestDatabase,
  cleanTestDatabase,
  closeTestDatabase,
  createTestUser,
  generateTestToken,
  getTestPool
} from './setup.integration.js';

describe('Admin API Integration Tests', () => {
  let adminUser, adminToken;
  let regularUser, regularToken;
  let testUserId;

  beforeAll(async () => {
    await initTestDatabase();
    await seedTestDatabase();
  });

  beforeEach(async () => {
    adminUser = await createTestUser('admin@giip.info', 'AdminPass123!', 'admin');
    adminToken = generateTestToken(adminUser.id, adminUser.email, adminUser.role_id);

    regularUser = await createTestUser('user@giip.info', 'UserPass123!', 'user');
    regularToken = generateTestToken(regularUser.id, regularUser.email, regularUser.role_id);

    const testUser = await createTestUser('testuser@giip.info', 'TestPass123!', 'user');
    testUserId = testUser.id;
  });

  afterEach(async () => {
    await cleanTestDatabase();
    await seedTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('GET /api/admin/users', () => {
    test('should get all users as admin', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Verify password is not included
      response.body.data.forEach(user => {
        expect(user.password).toBeUndefined();
        expect(user.email).toBeDefined();
      });
    });

    test('should reject non-admin user', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('should reject unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/admin/users');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/users/:id/role', () => {
    test('should update user role as admin', async () => {
      const pool = getTestPool();
      const editorRoleResult = await pool.query(
        'SELECT id FROM roles WHERE name = $1',
        ['editor']
      );
      const editorRoleId = editorRoleResult.rows[0].id;

      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role_id: editorRoleId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.role_id).toBe(editorRoleId);
    });

    test('should reject role update by non-admin', async () => {
      const pool = getTestPool();
      const editorRoleResult = await pool.query(
        'SELECT id FROM roles WHERE name = $1',
        ['editor']
      );
      const editorRoleId = editorRoleResult.rows[0].id;

      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/role`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send({ role_id: editorRoleId });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('should reject invalid role_id', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role_id: 99999 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 404 for non-existent user', async () => {
      const pool = getTestPool();
      const userRoleResult = await pool.query(
        'SELECT id FROM roles WHERE name = $1',
        ['user']
      );
      const userRoleId = userRoleResult.rows[0].id;

      const response = await request(app)
        .put('/api/admin/users/99999/role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role_id: userRoleId });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/admin/roles', () => {
    test('should create new role as admin', async () => {
      const roleData = {
        name: 'moderator',
        description: 'Content moderator role'
      };

      const response = await request(app)
        .post('/api/admin/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(roleData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(roleData.name);
      expect(response.body.data.description).toBe(roleData.description);
    });

    test('should reject role creation by non-admin', async () => {
      const roleData = {
        name: 'moderator',
        description: 'Content moderator role'
      };

      const response = await request(app)
        .post('/api/admin/roles')
        .set('Authorization', `Bearer ${regularToken}`)
        .send(roleData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('should reject duplicate role name', async () => {
      const roleData = {
        name: 'admin',
        description: 'Duplicate admin role'
      };

      const response = await request(app)
        .post('/api/admin/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(roleData);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/admin/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          description: 'Missing name field'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/admin/roles/:id/permissions', () => {
    test('should assign permission to role as admin', async () => {
      const pool = getTestPool();
      
      // Get role and permission IDs
      const roleResult = await pool.query(
        'SELECT id FROM roles WHERE name = $1',
        ['user']
      );
      const roleId = roleResult.rows[0].id;

      const permissionResult = await pool.query(
        'SELECT id FROM permissions WHERE name = $1',
        ['write:news']
      );
      const permissionId = permissionResult.rows[0].id;

      const response = await request(app)
        .post(`/api/admin/roles/${roleId}/permissions`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ permission_id: permissionId });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('assigned');
    });

    test('should reject permission assignment by non-admin', async () => {
      const pool = getTestPool();
      
      const roleResult = await pool.query(
        'SELECT id FROM roles WHERE name = $1',
        ['user']
      );
      const roleId = roleResult.rows[0].id;

      const permissionResult = await pool.query(
        'SELECT id FROM permissions WHERE name = $1',
        ['write:news']
      );
      const permissionId = permissionResult.rows[0].id;

      const response = await request(app)
        .post(`/api/admin/roles/${roleId}/permissions`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send({ permission_id: permissionId });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('should reject invalid permission_id', async () => {
      const pool = getTestPool();
      
      const roleResult = await pool.query(
        'SELECT id FROM roles WHERE name = $1',
        ['user']
      );
      const roleId = roleResult.rows[0].id;

      const response = await request(app)
        .post(`/api/admin/roles/${roleId}/permissions`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ permission_id: 99999 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
