import { createHash, randomUUID } from 'crypto';
import { HashRecord } from '../value-objects/hash-record.vo';

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

  generateHashRecord(content: string): HashRecord {
    return new HashRecord({
      id: this.generateId(),
      hash: this.calculateSha256(content),
      timestamp: this.generateTimestamp(),
    });
  }
}
