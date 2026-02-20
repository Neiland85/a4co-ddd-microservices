import { ReportStatus, ReportType } from '../../domain/entities/generated-report.entity.js';

export class ReportResponseDto {
  id!: string;
  caseId!: string;
  reportType!: ReportType;
  requestedBy!: string;
  status!: ReportStatus;
  storageUrl!: string | null;
  requestedAt!: string;
}
