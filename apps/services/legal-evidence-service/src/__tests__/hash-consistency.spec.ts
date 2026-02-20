import { createHash } from 'crypto';
import { HashService } from '../domain/services/hash.service.js';
import { HashRecord } from '../domain/value-objects/hash-record.vo.js';

describe('Hash consistency', () => {
  let hashService: HashService;

  beforeEach(() => {
    hashService = new HashService();
  });

  it('should produce the same SHA-256 hash for identical content', () => {
    const content = 'legal-evidence-document-body';
    const hash1 = hashService.calculateSha256(content);
    const hash2 = hashService.calculateSha256(content);
    expect(hash1).toBe(hash2);
  });

  it('should produce a 64-character hex string for SHA-256', () => {
    const hash = hashService.calculateSha256('some content');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should match the Node.js crypto SHA-256 for a known value', () => {
    const content = 'hello world';
    const expected = createHash('sha256').update(content).digest('hex');
    expect(hashService.calculateSha256(content)).toBe(expected);
  });

  it('should produce different hashes for different content', () => {
    const hash1 = hashService.calculateSha256('file A content');
    const hash2 = hashService.calculateSha256('file B content');
    expect(hash1).not.toBe(hash2);
  });

  it('should compute a HashRecord with SHA-256 algorithm and timestampUtc', () => {
    const record = hashService.computeHashRecord('evidence text');
    expect(record).toBeInstanceOf(HashRecord);
    expect(record.algorithm).toBe('SHA-256');
    expect(record.hashValue).toHaveLength(64);
    expect(record.timestampUtc).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('computeHashRecord should produce consistent hash for same content', () => {
    const content = 'deterministic content';
    const r1 = hashService.computeHashRecord(content);
    const r2 = hashService.computeHashRecord(content);
    expect(r1.hashValue).toBe(r2.hashValue);
    expect(r1.algorithm).toBe(r2.algorithm);
  });

  it('computeHashRecord hash should match calculateSha256', () => {
    const content = 'verify alignment';
    const record = hashService.computeHashRecord(content);
    expect(record.hashValue).toBe(hashService.calculateSha256(content));
  });
});
