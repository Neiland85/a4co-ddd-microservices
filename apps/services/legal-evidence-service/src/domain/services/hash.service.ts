import { createHash, randomUUID } from 'crypto';
import { HashRecord } from '../value-objects/hash-record.vo.js';

export class HashService {
  calculateSha256(content: string): string {
    return createHash('sha256').update(content, 'utf8').digest('hex');
  }

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
