import { createHash } from 'crypto';
import { HashRecord } from '../value-objects/hash-record.vo.js';

export class HashService {
  calculateSha256(content: string | Buffer): string {
    return createHash('sha256').update(content).digest('hex');
  }

  computeHashRecord(content: string | Buffer): HashRecord {
    return new HashRecord('SHA-256', this.calculateSha256(content), new Date());
  }
}
