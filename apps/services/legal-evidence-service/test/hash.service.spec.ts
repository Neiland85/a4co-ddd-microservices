import { HashService } from '../src/domain/services/hash.service';
import { HashRecord } from '../src/domain/value-objects/hash-record.vo';

describe('HashService', () => {
  let hashService: HashService;

  beforeEach(() => {
    hashService = new HashService();
  });

  describe('calculateSha256', () => {
    it('should return a 64-character hex string', () => {
      const hash = hashService.calculateSha256('test content');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should return consistent results for the same input', () => {
      const content = 'evidence document';
      expect(hashService.calculateSha256(content)).toBe(hashService.calculateSha256(content));
    });

    it('should return different hashes for different inputs', () => {
      expect(hashService.calculateSha256('abc')).not.toBe(hashService.calculateSha256('xyz'));
    });

    it('should compute the correct SHA-256 for a known value', () => {
      // SHA-256 of empty string
      const emptyHash = hashService.calculateSha256('');
      expect(emptyHash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });
  });

  describe('generateTimestamp', () => {
    it('should return a valid ISO 8601 string', () => {
      const timestamp = hashService.generateTimestamp();
      expect(() => new Date(timestamp)).not.toThrow();
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });

    it('should return a recent timestamp', () => {
      const before = Date.now();
      const timestamp = hashService.generateTimestamp();
      const after = Date.now();
      const ts = new Date(timestamp).getTime();
      expect(ts).toBeGreaterThanOrEqual(before);
      expect(ts).toBeLessThanOrEqual(after);
    });
  });

  describe('generateId', () => {
    it('should return a non-empty string', () => {
      const id = hashService.generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should return unique IDs on consecutive calls', () => {
      const id1 = hashService.generateId();
      const id2 = hashService.generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('generateHashRecord', () => {
    it('should return a HashRecord instance', () => {
      const record = hashService.generateHashRecord('sample content');
      expect(record).toBeInstanceOf(HashRecord);
    });

    it('should populate id, hash, and timestamp', () => {
      const record = hashService.generateHashRecord('sample content');
      expect(record.id).toBeTruthy();
      expect(record.hash).toHaveLength(64);
      expect(record.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should use the content to compute the hash', () => {
      const content = 'legal document body';
      const record = hashService.generateHashRecord(content);
      expect(record.hash).toBe(hashService.calculateSha256(content));
    });
  });
});
