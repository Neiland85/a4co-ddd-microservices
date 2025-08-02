import { formatDate, generateRandomId } from './utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('should format date to ISO string', () => {
      const date = new Date('2023-01-01T12:00:00.000Z');
      const result = formatDate(date);
      expect(result).toBe('2023-01-01T12:00:00.000Z');
    });

    it('should handle current date', () => {
      const date = new Date();
      const result = formatDate(date);
      expect(result).toBe(date.toISOString());
    });

    it('should handle different timezones', () => {
      const date = new Date('2023-06-15T09:30:45.123Z');
      const result = formatDate(date);
      expect(result).toBe('2023-06-15T09:30:45.123Z');
    });
  });

  describe('generateRandomId', () => {
    it('should generate a random id', () => {
      const id = generateRandomId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate different ids on multiple calls', () => {
      const id1 = generateRandomId();
      const id2 = generateRandomId();
      expect(id1).not.toBe(id2);
    });

    it('should generate ids with consistent length range', () => {
      const ids = Array.from({ length: 10 }, () => generateRandomId());
      ids.forEach(id => {
        expect(id.length).toBeGreaterThan(5);
        expect(id.length).toBeLessThan(20);
      });
    });

    it('should generate alphanumeric ids', () => {
      const id = generateRandomId();
      expect(id).toMatch(/^[a-z0-9]+$/);
    });
  });
});