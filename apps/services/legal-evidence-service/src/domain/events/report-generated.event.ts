import { DomainEvent } from '../base-classes.js';
import { ReportType } from '../entities/generated-report.entity.js';

export interface ReportGeneratedEventPayload {
  reportId: string;
  caseId: string;
  reportType: ReportType;
  requestedBy: string;
  storageUrl: string;
  timestamp: Date;
}

export class ReportGeneratedEvent extends DomainEvent {
  public readonly eventType = 'legal-evidence.report.generated.v1';

  constructor(
    public readonly reportId: string,
    public readonly caseId: string,
    public readonly reportType: ReportType,
    public readonly requestedBy: string,
    public readonly storageUrl: string,
    public readonly timestamp: Date = new Date(),
  ) {
    super(reportId, 'legal-evidence.report.generated.v1');
  }

  toJSON(): ReportGeneratedEventPayload {
    return {
      reportId: this.reportId,
      caseId: this.caseId,
      reportType: this.reportType,
      requestedBy: this.requestedBy,
      storageUrl: this.storageUrl,
      timestamp: this.timestamp,
    };
  }
}
