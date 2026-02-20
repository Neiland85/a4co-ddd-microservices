import { DomainEvent } from '../base-classes.js';

export interface EvidenceSubmittedEventPayload {
  evidenceId: string;
  caseId: string;
  title: string;
  submittedBy: string;
  timestamp: Date;
}

export class EvidenceSubmittedEvent extends DomainEvent {
  public readonly eventType = 'legal-evidence.evidence.submitted.v1';

  constructor(
    public readonly evidenceId: string,
    public readonly caseId: string,
    public readonly title: string,
    public readonly submittedBy: string,
    public readonly timestamp: Date = new Date(),
  ) {
    super(evidenceId, 'legal-evidence.evidence.submitted.v1');
  }

  toJSON(): EvidenceSubmittedEventPayload {
    return {
      evidenceId: this.evidenceId,
      caseId: this.caseId,
      title: this.title,
      submittedBy: this.submittedBy,
      timestamp: this.timestamp,
    };
  }
}
