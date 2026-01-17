import crypto from 'crypto';

export class EventIdFactory {
  static deterministic(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }
}
