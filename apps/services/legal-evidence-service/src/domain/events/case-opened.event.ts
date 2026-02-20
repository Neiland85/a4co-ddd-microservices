import { DomainEvent } from '../base-classes.js';

export interface CaseOpenedEventPayload {
  caseId: string;
  title: string;
  openedBy: string;
  timestamp: Date;
}

export class CaseOpenedEvent extends DomainEvent {
  public readonly eventType = 'legal-evidence.case.opened.v1';

  constructor(
    public readonly caseId: string,
    public readonly title: string,
    public readonly openedBy: string,
    public readonly timestamp: Date = new Date(),
  ) {
    super(caseId, 'legal-evidence.case.opened.v1');
  }

  toJSON(): CaseOpenedEventPayload {
    return {
      caseId: this.caseId,
      title: this.title,
      openedBy: this.openedBy,
      timestamp: this.timestamp,
    };
  }
}
