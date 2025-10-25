/**
 * Conferences API Integration Tests
 * Tests conferences CRUD operations and permission validation
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

describe('Conferences API Integration Tests', () => {
  let adminUser, adminToken;
  let editorUser, editorToken;
  let regularUser, regularToken;
  let conferenceId;

  beforeAll(async () => {
    await initTestDatabase();
    await seedTestDatabase();
  });

  beforeEach(async () => {
    adminUser = await createTestUser('admin@giip.info', 'AdminPass123!', 'admin');
    adminToken = generateTestToken(adminUser.id, adminUser.email, adminUser.role_id);

    editorUser = await createTestUser('editor@giip.info', 'EditorPass123!', 'editor');
    editorToken = generateTestToken(editorUser.id, editorUser.email, editorUser.role_id);

    regularUser = await createTestUser('user@giip.info', 'UserPass123!', 'user');
    regularToken = generateTestToken(regularUser.id, regularUser.email, regularUser.role_id);

    const pool = getTestPool();
    const result = await pool.query(
      `INSERT INTO conferences (title, description, date_range, location, summary, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      ['Test Conference', 'Test conference description', 'Nov 1-3, 2025', 'Conference Center', 'Test summary', editorUser.id]
    );
    conferenceId = result.rows[0].id;
  });

  afterEach(async () => {
    await cleanTestDatabase();
    await seedTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('GET /api/conferences', () => {
    test('should get all conferences with read:conferences permission', async () => {
      const response = await request(app)
        .get('/api/conferences')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/conferences');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/conferences/:id', () => {
    test('should get single conference by id', async () => {
      const response = await request(app)
        .get(`/api/conferences/${conferenceId}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(conferenceId);
      expect(response.body.data.title).toBe('Test Conference');
    });

    test('should return 404 for non-existent conference', async () => {
      const response = await request(app)
        .get('/api/conferences/99999')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/conferences', () => {
    test('should create conference with write:conferences permission', async () => {
      const conferenceData = {
        title: 'New Conference',
        description: 'New conference description',
        date_range: 'Dec 10-12, 2025',
        location: 'New Conference Center',
        summary: 'New conference summary'
      };

      const response = await request(app)
        .post('/api/conferences')
        .set('Authorization', `Bearer ${editorToken}`)
        .send(conferenceData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(conferenceData.title);
      expect(response.body.data.date_range).toBe(conferenceData.date_range);
    });

    test('should reject creation without write:conferences permission', async () => {
      const conferenceData = {
        title: 'New Conference',
        description: 'New conference description',
        date_range: 'Dec 10-12, 2025',
        location: 'New Conference Center',
        summary: 'New conference summary'
      };

      const response = await request(app)
        .post('/api/conferences')
        .set('Authorization', `Bearer ${regularToken}`)
        .send(conferenceData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/conferences')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Incomplete Conference'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/conferences/:id', () => {
    test('should allow owner to update their conference', async () => {
      const updateData = {
        title: 'Updated Conference',
        description: 'Updated description',
        date_range: 'Nov 15-17, 2025',
        location: 'Updated Center',
        summary: 'Updated summary'
      };

      const response = await request(app)
        .put(`/api/conferences/${conferenceId}`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
    });

    test('should allow admin with edit:conferences permission to update any conference', async () => {
      const updateData = {
        title: 'Admin Updated Conference',
        description: 'Admin updated',
        date_range: 'Nov 20-22, 2025',
        location: 'Admin Center',
        summary: 'Admin summary'
      };

      const response = await request(app)
        .put(`/api/conferences/${conferenceId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should reject update by non-owner without edit:conferences permission', async () => {
      const updateData = {
        title: 'Unauthorized Update',
        description: 'Should fail',
        date_range: 'Nov 20-22, 2025',
        location: 'Fail Center',
        summary: 'Fail summary'
      };

      const response = await request(app)
        .put(`/api/conferences/${conferenceId}`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/conferences/:id', () => {
    test('should delete conference with delete:conferences permission', async () => {
      const response = await request(app)
        .delete(`/api/conferences/${conferenceId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should reject deletion without delete:conferences permission', async () => {
      const response = await request(app)
        .delete(`/api/conferences/${conferenceId}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/conferences - Time Classification', () => {
    let activeConferenceId, pastConferenceId;

    beforeEach(async () => {
      const pool = getTestPool();
      
      // Create an active conference (end date in the future)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);
      const activeResult = await pool.query(
        `INSERT INTO conferences (title, description, start_date, end_date, location, summary, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        ['Active Conference', 'Future conference', new Date().toISOString(), futureDate.toISOString(), 'Conference Center', 'Active summary', editorUser.id]
      );
      activeConferenceId = activeResult.rows[0].id;

      // Create a past conference (end date in the past)
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 14);
      const pastResult = await pool.query(
        `INSERT INTO conferences (title, description, start_date, end_date, location, summary, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        ['Past Conference', 'Past conference', pastDate.toISOString(), pastDate.toISOString(), 'Conference Center', 'Past summary', editorUser.id]
      );
      pastConferenceId = pastResult.rows[0].id;
    });

    test('should filter active conferences correctly', async () => {
      const response = await request(app)
        .get('/api/conferences?status=active')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // All returned conferences should have status 'active'
      response.body.data.forEach(conference => {
        expect(conference.status).toBe('active');
        if (conference.end_date) {
          expect(new Date(conference.end_date).getTime()).toBeGreaterThanOrEqual(new Date().getTime());
        }
      });

      // Should include the active conference we created
      const activeConference = response.body.data.find(c => c.id === activeConferenceId);
      expect(activeConference).toBeDefined();
    });

    test('should filter past conferences correctly', async () => {
      const response = await request(app)
        .get('/api/conferences?status=past')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // All returned conferences should have status 'past'
      response.body.data.forEach(conference => {
        expect(conference.status).toBe('past');
        expect(conference.end_date).toBeDefined();
        expect(new Date(conference.end_date).getTime()).toBeLessThan(new Date().getTime());
      });

      // Should include the past conference we created
      const pastConference = response.body.data.find(c => c.id === pastConferenceId);
      expect(pastConference).toBeDefined();
    });

    test('should return all conferences when status is not specified', async () => {
      const response = await request(app)
        .get('/api/conferences')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Should include both active and past conferences
      const hasActive = response.body.data.some(c => c.status === 'active');
      const hasPast = response.body.data.some(c => c.status === 'past');
      expect(hasActive || hasPast).toBe(true);
    });

    test('should sort conferences by start_date descending by default', async () => {
      const response = await request(app)
        .get('/api/conferences?status=all')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Check if sorted by start_date descending
      for (let i = 0; i < response.body.data.length - 1; i++) {
        const current = response.body.data[i];
        const next = response.body.data[i + 1];
        
        if (current.start_date && next.start_date) {
          expect(new Date(current.start_date).getTime()).toBeGreaterThanOrEqual(new Date(next.start_date).getTime());
        }
      }
    });

    test('should support custom sorting by end_date', async () => {
      const response = await request(app)
        .get('/api/conferences?sortBy=end_date&sortOrder=asc')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      
      // Check if sorted by end_date ascending
      for (let i = 0; i < response.body.data.length - 1; i++) {
        const current = response.body.data[i];
        const next = response.body.data[i + 1];
        
        if (current.end_date && next.end_date) {
          expect(new Date(current.end_date).getTime()).toBeLessThanOrEqual(new Date(next.end_date).getTime());
        }
      }
    });

    test('should compute status correctly for conferences without end_date', async () => {
      const pool = getTestPool();
      const result = await pool.query(
        `INSERT INTO conferences (title, description, start_date, location, summary, created_by)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        ['No End Date Conference', 'Conference without end date', new Date().toISOString(), 'Conference Center', 'Summary', editorUser.id]
      );
      const noEndDateConferenceId = result.rows[0].id;

      const response = await request(app)
        .get(`/api/conferences/${noEndDateConferenceId}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('active');
    });

    test('should validate date range on create', async () => {
      const invalidConferenceData = {
        title: 'Invalid Conference',
        description: 'Conference with invalid date range',
        start_date: '2025-11-20T10:00:00Z',
        end_date: '2025-11-19T10:00:00Z', // End before start
        location: 'Conference Center',
        summary: 'Invalid summary'
      };

      const response = await request(app)
        .post('/api/conferences')
        .set('Authorization', `Bearer ${editorToken}`)
        .send(invalidConferenceData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
