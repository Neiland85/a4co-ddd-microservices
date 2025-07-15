import { formatDate, generateRandomId } from './index';

describe('Shared Utils', () => {
  it('should format a date correctly', () => {
    const date = new Date('2025-07-15');
    expect(formatDate(date)).toBe('2025-07-15T00:00:00.000Z');
  });

  it('should generate a random ID', () => {
    const id = generateRandomId();
    expect(id).toMatch(/^[a-z0-9]{13}$/);
  });
});
