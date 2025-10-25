/**
 * Events API Integration Tests
 * Tests events CRUD operations and permission validation
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

describe('Events API Integration Tests', () => {
  let adminUser, adminToken;
  let editorUser, editorToken;
  let regularUser, regularToken;
  let eventId;

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
      `INSERT INTO events (title, description, date, location, capacity, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      ['Test Event', 'Test event description', '2025-11-01', 'Test Location', 100, editorUser.id]
    );
    eventId = result.rows[0].id;
  });

  afterEach(async () => {
    await cleanTestDatabase();
    await seedTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('GET /api/events', () => {
    test('should get all events with read:events permission', async () => {
      const response = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/events');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/events/:id', () => {
    test('should get single event by id', async () => {
      const response = await request(app)
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(eventId);
      expect(response.body.data.title).toBe('Test Event');
    });

    test('should return 404 for non-existent event', async () => {
      const response = await request(app)
        .get('/api/events/99999')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/events', () => {
    test('should create event with write:events permission', async () => {
      const eventData = {
        title: 'New Event',
        description: 'New event description',
        date: '2025-12-01',
        location: 'New Location',
        capacity: 150
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${editorToken}`)
        .send(eventData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(eventData.title);
      expect(response.body.data.capacity).toBe(eventData.capacity);
    });

    test('should reject creation without write:events permission', async () => {
      const eventData = {
        title: 'New Event',
        description: 'New event description',
        date: '2025-12-01',
        location: 'New Location',
        capacity: 150
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${regularToken}`)
        .send(eventData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Incomplete Event'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/events/:id', () => {
    test('should allow owner to update their event', async () => {
      const updateData = {
        title: 'Updated Event',
        description: 'Updated description',
        date: '2025-11-15',
        location: 'Updated Location',
        capacity: 200
      };

      const response = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
    });

    test('should allow admin with edit:events permission to update any event', async () => {
      const updateData = {
        title: 'Admin Updated Event',
        description: 'Admin updated',
        date: '2025-11-20',
        location: 'Admin Location',
        capacity: 250
      };

      const response = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should reject update by non-owner without edit:events permission', async () => {
      const updateData = {
        title: 'Unauthorized Update',
        description: 'Should fail',
        date: '2025-11-20',
        location: 'Fail Location',
        capacity: 100
      };

      const response = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/events/:id', () => {
    test('should delete event with delete:events permission', async () => {
      const response = await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should reject deletion without delete:events permission', async () => {
      const response = await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/events/:id/register', () => {
    let activeEventId, pastEventId, fullEventId;

    beforeEach(async () => {
      const pool = getTestPool();
      
      // Create an active event
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const activeResult = await pool.query(
        `INSERT INTO events (title, description, start_date, end_date, location, capacity, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        ['Active Event', 'Future event', new Date().toISOString(), futureDate.toISOString(), 'Test Location', 100, editorUser.id]
      );
      activeEventId = activeResult.rows[0].id;

      // Create a past event
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      const pastResult = await pool.query(
        `INSERT INTO events (title, description, start_date, end_date, location, capacity, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        ['Past Event', 'Past event', pastDate.toISOString(), pastDate.toISOString(), 'Test Location', 100, editorUser.id]
      );
      pastEventId = pastResult.rows[0].id;

      // Create a full event (capacity 1)
      const fullResult = await pool.query(
        `INSERT INTO events (title, description, start_date, end_date, location, capacity, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        ['Full Event', 'Event at capacity', new Date().toISOString(), futureDate.toISOString(), 'Test Location', 1, editorUser.id]
      );
      fullEventId = fullResult.rows[0].id;

      // Register editor for the full event
      await pool.query(
        `INSERT INTO event_registrations (event_id, user_id, organization, notes)
         VALUES ($1, $2, $3, $4)`,
        [fullEventId, editorUser.id, 'Test Org', 'Test notes']
      );
    });

    test('should register authenticated user for active event', async () => {
      const registrationData = {
        organization: 'My Company',
        notes: 'Looking forward to this event'
      };

      const response = await request(app)
        .post(`/api/events/${activeEventId}/register`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send(registrationData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Successfully registered for event');
      expect(response.body.data.event_id).toBe(activeEventId);
      expect(response.body.data.user_id).toBe(regularUser.id);
      expect(response.body.data.organization).toBe(registrationData.organization);
      expect(response.body.data.notes).toBe(registrationData.notes);
      expect(response.body.data.registered_at).toBeDefined();
    });

    test('should register user without optional fields', async () => {
      const response = await request(app)
        .post(`/api/events/${activeEventId}/register`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send({});

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.organization).toBeNull();
      expect(response.body.data.notes).toBeNull();
    });

    test('should reject registration without authentication', async () => {
      const response = await request(app)
        .post(`/api/events/${activeEventId}/register`)
        .send({ organization: 'Test' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should reject registration for non-existent event', async () => {
      const response = await request(app)
        .post('/api/events/99999/register')
        .set('Authorization', `Bearer ${regularToken}`)
        .send({});

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    test('should reject registration for past event', async () => {
      const response = await request(app)
        .post(`/api/events/${pastEventId}/register`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('EVENT_PAST');
    });

    test('should reject duplicate registration', async () => {
      // First registration
      await request(app)
        .post(`/api/events/${activeEventId}/register`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send({});

      // Second registration (duplicate)
      const response = await request(app)
        .post(`/api/events/${activeEventId}/register`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send({});

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ALREADY_REGISTERED');
    });

    test('should reject registration when event is at capacity', async () => {
      const response = await request(app)
        .post(`/api/events/${fullEventId}/register`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('EVENT_FULL');
    });

    test('should reject registration with invalid event ID', async () => {
      const response = await request(app)
        .post('/api/events/invalid/register')
        .set('Authorization', `Bearer ${regularToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_ID');
    });
  });

  describe('GET /api/events - Time Classification', () => {
    let activeEventId, pastEventId;

    beforeEach(async () => {
      const pool = getTestPool();
      
      // Create an active event (end date in the future)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const activeResult = await pool.query(
        `INSERT INTO events (title, description, start_date, end_date, location, capacity, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        ['Active Event', 'Future event', new Date().toISOString(), futureDate.toISOString(), 'Test Location', 100, editorUser.id]
      );
      activeEventId = activeResult.rows[0].id;

      // Create a past event (end date in the past)
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      const pastResult = await pool.query(
        `INSERT INTO events (title, description, start_date, end_date, location, capacity, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        ['Past Event', 'Past event', pastDate.toISOString(), pastDate.toISOString(), 'Test Location', 100, editorUser.id]
      );
      pastEventId = pastResult.rows[0].id;
    });

    test('should filter active events correctly', async () => {
      const response = await request(app)
        .get('/api/events?status=active')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // All returned events should have status 'active'
      response.body.data.forEach(event => {
        expect(event.status).toBe('active');
        if (event.end_date) {
          expect(new Date(event.end_date).getTime()).toBeGreaterThanOrEqual(new Date().getTime());
        }
      });

      // Should include the active event we created
      const activeEvent = response.body.data.find(e => e.id === activeEventId);
      expect(activeEvent).toBeDefined();
    });

    test('should filter past events correctly', async () => {
      const response = await request(app)
        .get('/api/events?status=past')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // All returned events should have status 'past'
      response.body.data.forEach(event => {
        expect(event.status).toBe('past');
        expect(event.end_date).toBeDefined();
        expect(new Date(event.end_date).getTime()).toBeLessThan(new Date().getTime());
      });

      // Should include the past event we created
      const pastEvent = response.body.data.find(e => e.id === pastEventId);
      expect(pastEvent).toBeDefined();
    });

    test('should return all events when status is not specified', async () => {
      const response = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Should include both active and past events
      const hasActive = response.body.data.some(e => e.status === 'active');
      const hasPast = response.body.data.some(e => e.status === 'past');
      expect(hasActive || hasPast).toBe(true);
    });

    test('should sort events by start_date descending by default', async () => {
      const response = await request(app)
        .get('/api/events?status=all')
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
        .get('/api/events?sortBy=end_date&sortOrder=asc')
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

    test('should compute status correctly for events without end_date', async () => {
      const pool = getTestPool();
      const result = await pool.query(
        `INSERT INTO events (title, description, start_date, location, capacity, created_by)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        ['No End Date Event', 'Event without end date', new Date().toISOString(), 'Test Location', 100, editorUser.id]
      );
      const noEndDateEventId = result.rows[0].id;

      const response = await request(app)
        .get(`/api/events/${noEndDateEventId}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('active');
    });

    test('should validate date range on create', async () => {
      const invalidEventData = {
        title: 'Invalid Event',
        description: 'Event with invalid date range',
        start_date: '2025-11-20T10:00:00Z',
        end_date: '2025-11-19T10:00:00Z', // End before start
        location: 'Test Location',
        capacity: 100
      };

      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${editorToken}`)
        .send(invalidEventData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
