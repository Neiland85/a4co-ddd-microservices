export enum ChainOfCustodyEventType {
  EVIDENCE_UPLOADED = 'EVIDENCE_UPLOADED',
  EVIDENCE_HASHED = 'EVIDENCE_HASHED',
  EVIDENCE_ACCESSED = 'EVIDENCE_ACCESSED',
  EVIDENCE_EXPORTED = 'EVIDENCE_EXPORTED',
  REPORT_GENERATED = 'REPORT_GENERATED',
}

export interface ChainOfCustodyEvent {
  id: string;
  eventType: ChainOfCustodyEventType;
  userId: string;
  metadata?: Record<string, unknown> | null;
  timestamp: Date;
}

export interface CreateChainOfCustodyEventDto {
  eventType: ChainOfCustodyEventType;
  userId: string;
  metadata?: Record<string, unknown>;
}
