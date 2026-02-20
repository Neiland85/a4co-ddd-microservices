import { DomainEvent } from '../base-classes.js';

export interface CustodyTransferredEventPayload {
  custodyEventId: string;
  evidenceId: string;
  fromCustodian: string | null;
  toCustodian: string;
  reason: string;
  timestamp: Date;
}

export class CustodyTransferredEvent extends DomainEvent {
  public readonly eventType = 'legal-evidence.custody.transferred.v1';

  constructor(
    public readonly custodyEventId: string,
    public readonly evidenceId: string,
    public readonly fromCustodian: string | null,
    public readonly toCustodian: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date(),
  ) {
    super(evidenceId, 'legal-evidence.custody.transferred.v1');
  }

  toJSON(): CustodyTransferredEventPayload {
    return {
      custodyEventId: this.custodyEventId,
      evidenceId: this.evidenceId,
      fromCustodian: this.fromCustodian,
      toCustodian: this.toCustodian,
      reason: this.reason,
      timestamp: this.timestamp,
    };
  }
}
