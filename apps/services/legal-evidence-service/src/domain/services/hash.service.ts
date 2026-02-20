import { createHash } from 'crypto';
import { createHash, randomUUID } from 'crypto';
import { HashRecord } from '../value-objects/hash-record.vo.js';

export class HashService {
  calculateSha256(content: string | Buffer): string {
    return createHash('sha256').update(content).digest('hex');
  }

  computeHashRecord(content: string | Buffer): HashRecord {
    return new HashRecord('SHA-256', this.calculateSha256(content), new Date());
  generateTimestamp(): string {
    return new Date().toISOString();
  }

  generateId(): string {
    return randomUUID();
  }

  computeSha256(content: string): HashRecord {
    return new HashRecord('SHA-256', this.calculateSha256(content), new Date());
  generateHashRecord(content: string): HashRecord {
    return new HashRecord('SHA-256', this.calculateSha256(content));
  }
}
