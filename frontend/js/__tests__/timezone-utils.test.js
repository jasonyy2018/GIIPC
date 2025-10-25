/**
 * Timezone Utilities Unit Tests
 * Tests for timezone conversion and date formatting functions
 */

import {
  utcToLocal,
  localToUtc,
  formatDate,
  formatDateTime,
  formatDateRange,
  formatDateTimeRange,
  formatDateTimeLocal,
  formatEventBadge,
  computeStatus
} from '../timezone-utils.js';

describe('Timezone Utilities', () => {
  describe('utcToLocal', () => {
    test('should convert valid UTC string to local Date object', () => {
      const utcString = '2025-11-15T10:00:00Z';
      const result = utcToLocal(utcString);
      
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe(utcString);
    });

    test('should return null for invalid date string', () => {
      expect(utcToLocal('invalid-date')).toBeNull();
    });

    test('should return null for null input', () => {
      expect(utcToLocal(null)).toBeNull();
    });

    test('should return null for undefined input', () => {
      expect(utcToLocal(undefined)).toBeNull();
    });
  });

  describe('localToUtc', () => {
    test('should convert Date object to UTC ISO string', () => {
      const date = new Date('2025-11-15T10:00:00Z');
      const result = localToUtc(date);
      
      expect(result).toBe('2025-11-15T10:00:00.000Z');
    });

    test('should return null for invalid input', () => {
      expect(localToUtc('not-a-date')).toBeNull();
    });

    test('should return null for null input', () => {
      expect(localToUtc(null)).toBeNull();
    });
  });

  describe('formatDate', () => {
    test('should format date correctly', () => {
      const utcString = '2025-11-15T10:00:00Z';
      const result = formatDate(utcString);
      
      // Result will vary based on locale, but should contain year, month, day
      expect(result).toContain('2025');
      expect(result).toContain('November');
      expect(result).toContain('15');
    });

    test('should return "TBD" for invalid date', () => {
      expect(formatDate('invalid')).toBe('TBD');
    });

    test('should return "TBD" for null input', () => {
      expect(formatDate(null)).toBe('TBD');
    });
  });

  describe('formatDateTime', () => {
    test('should format date and time correctly', () => {
      const utcString = '2025-11-15T14:30:00Z';
      const result = formatDateTime(utcString);
      
      // Result will vary based on locale and timezone
      expect(result).toContain('2025');
      expect(result).toContain('Nov');
      expect(result).toContain('15');
      expect(result).toContain('at');
    });

    test('should return "TBD" for invalid date', () => {
      expect(formatDateTime('invalid')).toBe('TBD');
    });
  });

  describe('formatDateRange', () => {
    test('should format same day correctly', () => {
      const start = '2025-11-15T09:00:00Z';
      const end = '2025-11-15T17:00:00Z';
      const result = formatDateRange(start, end);
      
      expect(result).toContain('Nov');
      expect(result).toContain('15');
      expect(result).toContain('2025');
      // Should not have a range separator for same day
      expect(result.split('-').length).toBe(1);
    });

    test('should format same month range correctly', () => {
      const start = '2025-11-15T09:00:00Z';
      const end = '2025-11-17T17:00:00Z';
      const result = formatDateRange(start, end);
      
      expect(result).toContain('Nov');
      expect(result).toContain('15');
      expect(result).toContain('17');
      expect(result).toContain('2025');
      expect(result).toContain('-');
    });

    test('should format different month range correctly', () => {
      const start = '2025-11-15T09:00:00Z';
      const end = '2025-12-17T17:00:00Z';
      const result = formatDateRange(start, end);
      
      expect(result).toContain('Nov');
      expect(result).toContain('Dec');
      expect(result).toContain('15');
      expect(result).toContain('17');
      expect(result).toContain('2025');
    });

    test('should format different year range correctly', () => {
      const start = '2025-12-15T09:00:00Z';
      const end = '2026-01-17T17:00:00Z';
      const result = formatDateRange(start, end);
      
      expect(result).toContain('2025');
      expect(result).toContain('2026');
      expect(result).toContain('Dec');
      expect(result).toContain('Jan');
    });

    test('should handle null end date', () => {
      const start = '2025-11-15T09:00:00Z';
      const result = formatDateRange(start, null);
      
      expect(result).toContain('Nov');
      expect(result).toContain('15');
      expect(result).toContain('2025');
    });

    test('should return "TBD" for invalid start date', () => {
      expect(formatDateRange('invalid', '2025-11-17T17:00:00Z')).toBe('TBD');
    });
  });

  describe('formatEventBadge', () => {
    test('should format event badge correctly', () => {
      const utcString = '2025-11-15T10:00:00Z';
      const result = formatEventBadge(utcString);
      
      expect(result).toHaveProperty('day');
      expect(result).toHaveProperty('month');
      expect(result).toHaveProperty('year');
      expect(result.year).toBe(2025);
      expect(result.month).toBe('Nov');
      expect(result.day).toBe(15);
    });

    test('should return placeholder for invalid date', () => {
      const result = formatEventBadge('invalid');
      
      expect(result.day).toBe('?');
      expect(result.month).toBe('?');
      expect(result.year).toBe('?');
    });
  });

  describe('computeStatus', () => {
    test('should return "active" for future end date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const result = computeStatus(futureDate.toISOString());
      
      expect(result).toBe('active');
    });

    test('should return "past" for past end date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      const result = computeStatus(pastDate.toISOString());
      
      expect(result).toBe('past');
    });

    test('should return "active" for null end date', () => {
      expect(computeStatus(null)).toBe('active');
    });

    test('should return "active" for undefined end date', () => {
      expect(computeStatus(undefined)).toBe('active');
    });

    test('should return "active" for current time (edge case)', () => {
      const now = new Date();
      const result = computeStatus(now.toISOString());
      
      // Current time should be considered active
      expect(result).toBe('active');
    });
  });

  describe('formatDateTimeLocal', () => {
    test('should format for datetime-local input', () => {
      const utcString = '2025-11-15T14:30:00Z';
      const result = formatDateTimeLocal(utcString);
      
      // Format should be YYYY-MM-DDTHH:mm
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      expect(result).toContain('2025');
      expect(result).toContain('T');
    });

    test('should return empty string for invalid date', () => {
      expect(formatDateTimeLocal('invalid')).toBe('');
    });

    test('should return empty string for null input', () => {
      expect(formatDateTimeLocal(null)).toBe('');
    });
  });
});
