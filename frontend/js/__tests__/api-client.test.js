/**
 * API Client Unit Tests
 * Tests for EventsAPI and ConferencesAPI methods
 */

import { EventsAPI, ConferencesAPI } from '../api-client.js';

// Mock fetch globally
global.fetch = jest.fn();

describe('EventsAPI', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getActive', () => {
    test('should call API with correct active status parameters', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: 1,
            title: 'Active Event',
            status: 'active',
            start_date: '2025-11-15T09:00:00Z',
            end_date: '2025-11-15T17:00:00Z'
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          totalCount: 1
        }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await EventsAPI.getActive();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toContain('status=active');
      expect(callUrl).toContain('sortBy=start_date');
      expect(callUrl).toContain('sortOrder=asc');
      expect(result).toEqual(mockResponse);
    });

    test('should support custom options', async () => {
      const mockResponse = {
        success: true,
        data: [],
        pagination: {}
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await EventsAPI.getActive({ page: 2, limit: 20 });

      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toContain('page=2');
      expect(callUrl).toContain('limit=20');
      expect(callUrl).toContain('status=active');
    });
  });

  describe('getPast', () => {
    test('should call API with correct past status parameters', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: 2,
            title: 'Past Event',
            status: 'past',
            start_date: '2025-10-15T09:00:00Z',
            end_date: '2025-10-15T17:00:00Z'
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          totalCount: 1
        }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await EventsAPI.getPast();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toContain('status=past');
      expect(callUrl).toContain('sortBy=end_date');
      expect(callUrl).toContain('sortOrder=desc');
      expect(result).toEqual(mockResponse);
    });

    test('should support custom options', async () => {
      const mockResponse = {
        success: true,
        data: [],
        pagination: {}
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await EventsAPI.getPast({ page: 3, limit: 5 });

      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toContain('page=3');
      expect(callUrl).toContain('limit=5');
      expect(callUrl).toContain('status=past');
    });
  });
});

describe('ConferencesAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getActive', () => {
    test('should call API with correct active status parameters', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: 1,
            title: 'Active Conference',
            status: 'active',
            start_date: '2025-11-15T08:00:00Z',
            end_date: '2025-11-17T18:00:00Z'
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          totalCount: 1
        }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await ConferencesAPI.getActive();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toContain('status=active');
      expect(callUrl).toContain('sortBy=start_date');
      expect(callUrl).toContain('sortOrder=asc');
      expect(result).toEqual(mockResponse);
    });

    test('should support custom options', async () => {
      const mockResponse = {
        success: true,
        data: [],
        pagination: {}
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await ConferencesAPI.getActive({ page: 2, limit: 15 });

      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toContain('page=2');
      expect(callUrl).toContain('limit=15');
      expect(callUrl).toContain('status=active');
    });
  });

  describe('getPast', () => {
    test('should call API with correct past status parameters', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            id: 2,
            title: 'Past Conference',
            status: 'past',
            start_date: '2025-09-15T08:00:00Z',
            end_date: '2025-09-17T18:00:00Z'
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          totalCount: 1
        }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await ConferencesAPI.getPast();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toContain('status=past');
      expect(callUrl).toContain('sortBy=end_date');
      expect(callUrl).toContain('sortOrder=desc');
      expect(result).toEqual(mockResponse);
    });

    test('should support custom options', async () => {
      const mockResponse = {
        success: true,
        data: [],
        pagination: {}
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await ConferencesAPI.getPast({ page: 4, limit: 8 });

      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toContain('page=4');
      expect(callUrl).toContain('limit=8');
      expect(callUrl).toContain('status=past');
    });
  });
});
