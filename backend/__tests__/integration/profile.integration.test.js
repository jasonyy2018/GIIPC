import request from 'supertest';
import app from '../../src/server.js';
import { query } from '../../src/config/db.js';

describe('Profile API Integration Tests', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@giip.com',
        password: 'password'
      });

    authToken = loginResponse.body.token;
    userId = loginResponse.body.user.id;
  });

  describe('GET /api/profile', () => {
    it('should get user profile with authentication', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('id');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/profile', () => {
    it('should update profile successfully', async () => {
      const profileData = {
        full_name: 'Test User',
        phone: '+1234567890',
        organization: 'Test Org',
        position: 'Tester',
        country: 'USA',
        city: 'Test City'
      };

      const response = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.full_name).toBe(profileData.full_name);
      expect(response.body.data.phone).toBe(profileData.phone);
    });

    it('should update partial profile', async () => {
      const response = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ full_name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.data.full_name).toBe('Updated Name');
    });

    it('should fail with invalid avatar URL', async () => {
      const response = await request(app)
        .put('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ avatar_url: 'not-a-url' });

      expect(response.status).toBe(400);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .put('/api/profile')
        .send({ full_name: 'Test' });

      expect(response.status).toBe(401);
    });
  });
});
