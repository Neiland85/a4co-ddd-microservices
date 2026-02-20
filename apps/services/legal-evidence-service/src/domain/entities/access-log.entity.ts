export enum AccessAction {
  VIEW = 'VIEW',
  DOWNLOAD = 'DOWNLOAD',
  EXPORT = 'EXPORT',
  REPORT_GENERATED = 'REPORT_GENERATED',
}

export class AccessLog {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly caseId: string,
    public readonly evidenceId: string | null,
    public readonly action: AccessAction,
    public readonly ipAddress: string | null,
    public readonly userAgent: string | null,
    public readonly timestampUtc: Date = new Date(),
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('AccessLog id cannot be empty');
    }
    if (!userId || userId.trim().length === 0) {
      throw new Error('userId cannot be empty');
    }
    if (!caseId || caseId.trim().length === 0) {
      throw new Error('caseId cannot be empty');
    }
  }
}
