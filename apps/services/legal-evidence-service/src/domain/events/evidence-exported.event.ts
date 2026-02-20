import { DomainEvent } from '../base-classes.js';

export interface EvidenceExportedEventPayload {
  evidenceId: string;
  caseId: string;
  exportedBy: string;
  packageHash: string;
  timestamp: Date;
}

export class EvidenceExportedEvent extends DomainEvent {
  public readonly eventType = 'legal-evidence.evidence.exported.v1';

  constructor(
    public readonly evidenceId: string,
    public readonly caseId: string,
    public readonly exportedBy: string,
    public readonly packageHash: string,
    public readonly timestamp: Date = new Date(),
  ) {
    super(evidenceId, 'legal-evidence.evidence.exported.v1');
  }

  toJSON(): EvidenceExportedEventPayload {
    return {
      evidenceId: this.evidenceId,
      caseId: this.caseId,
      exportedBy: this.exportedBy,
      packageHash: this.packageHash,
      timestamp: this.timestamp,
    };
  }
}
