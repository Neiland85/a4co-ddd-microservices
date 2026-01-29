export type OutboxStatus = 'PENDING' | 'PUBLISHED' | 'FAILED';

export interface OutboxRecord {
  id: string;
  eventId: string;
  eventType: string;
  eventVersion: number;
  aggregateType: string;
  aggregateId: string;
  payload: unknown;
  status: OutboxStatus;
  attempts: number;
  nextRetryAt?: Date | null;
  lockedAt?: Date | null;
  lockedBy?: string | null;
}

export interface OutboxStorePort {
  enqueue(event: {
    eventId: string;
    eventType: string;
    eventVersion: number;
    aggregateType: string;
    aggregateId: string;
    payload: unknown;
  }): Promise<void>;

  // Para worker
  lockBatch(args: {
    limit: number;
    lockedBy: string;
  }): Promise<OutboxRecord[]>;

  markPublished(id: string): Promise<void>;
  markFailed(args: { id: string; error: string; nextRetryAt: Date }): Promise<void>;
}
