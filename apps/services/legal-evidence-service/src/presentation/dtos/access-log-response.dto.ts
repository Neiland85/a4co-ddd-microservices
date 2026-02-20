import { AccessAction } from '../../domain/entities/access-log.entity.js';

export interface AccessLogResponseDto {
  userId: string;
  caseId: string;
  evidenceId: string;
  action: AccessAction;
  ipAddress: string | null;
  userAgent: string | null;
  timestampUtc: string;
}
