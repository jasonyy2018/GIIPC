/**
 * News API Integration Tests
 * Tests news CRUD operations and permission validation
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

describe('News API Integration Tests', () => {
  let adminUser, adminToken;
  let editorUser, editorToken;
  let regularUser, regularToken;
  let newsId;

  beforeAll(async () => {
    await initTestDatabase();
    await seedTestDatabase();
  });

  beforeEach(async () => {
    // Create test users
    adminUser = await createTestUser('admin@giip.info', 'AdminPass123!', 'admin');
    adminToken = generateTestToken(adminUser.id, adminUser.email, adminUser.role_id);

    editorUser = await createTestUser('editor@giip.info', 'EditorPass123!', 'editor');
    editorToken = generateTestToken(editorUser.id, editorUser.email, editorUser.role_id);

    regularUser = await createTestUser('user@giip.info', 'UserPass123!', 'user');
    regularToken = generateTestToken(regularUser.id, regularUser.email, regularUser.role_id);

    // Create a test news article
    const pool = getTestPool();
    const result = await pool.query(
      `INSERT INTO news (title, content, image_url, published_date, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Test News', 'Test content', 'https://example.com/image.jpg', '2025-10-18', editorUser.id]
    );
    newsId = result.rows[0].id;
  });

  afterEach(async () => {
    await cleanTestDatabase();
    await seedTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('GET /api/news', () => {
    test('should get all news with valid token and read:news permission', async () => {
      const response = await request(app)
        .get('/api/news')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/news');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/news')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/news/:id', () => {
    test('should get single news article by id', async () => {
      const response = await request(app)
        .get(`/api/news/${newsId}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(newsId);
      expect(response.body.data.title).toBe('Test News');
    });

    test('should return 404 for non-existent news', async () => {
      const response = await request(app)
        .get('/api/news/99999')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/news', () => {
    test('should create news with write:news permission', async () => {
      const newsData = {
        title: 'New Article',
        content: 'Article content here',
        image_url: 'https://example.com/new.jpg',
        published_date: '2025-10-19'
      };

      const response = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${editorToken}`)
        .send(newsData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(newsData.title);
      expect(response.body.data.created_by).toBe(editorUser.id);
    });

    test('should reject creation without write:news permission', async () => {
      const newsData = {
        title: 'New Article',
        content: 'Article content here',
        image_url: 'https://example.com/new.jpg',
        published_date: '2025-10-19'
      };

      const response = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${regularToken}`)
        .send(newsData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('should reject creation with invalid data', async () => {
      const response = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'No content'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/news/:id', () => {
    test('should allow owner to update their news', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
        image_url: 'https://example.com/updated.jpg',
        published_date: '2025-10-20'
      };

      const response = await request(app)
        .put(`/api/news/${newsId}`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
    });

    test('should allow admin with edit:news permission to update any news', async () => {
      const updateData = {
        title: 'Admin Updated',
        content: 'Admin updated content',
        image_url: 'https://example.com/admin.jpg',
        published_date: '2025-10-20'
      };

      const response = await request(app)
        .put(`/api/news/${newsId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should reject update by non-owner without edit:news permission', async () => {
      const updateData = {
        title: 'Unauthorized Update',
        content: 'Should not work',
        image_url: 'https://example.com/fail.jpg',
        published_date: '2025-10-20'
      };

      const response = await request(app)
        .put(`/api/news/${newsId}`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/news/:id', () => {
    test('should delete news with delete:news permission', async () => {
      const response = await request(app)
        .delete(`/api/news/${newsId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');
    });

    test('should reject deletion without delete:news permission', async () => {
      const response = await request(app)
        .delete(`/api/news/${newsId}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('should return 404 when deleting non-existent news', async () => {
      const response = await request(app)
        .delete('/api/news/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
