export enum ReportType {
  CASE_SUMMARY = 'CASE_SUMMARY',
  EVIDENCE_INVENTORY = 'EVIDENCE_INVENTORY',
  CHAIN_OF_CUSTODY = 'CHAIN_OF_CUSTODY',
  ACCESS_AUDIT = 'ACCESS_AUDIT',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  GENERATED = 'GENERATED',
  FAILED = 'FAILED',
}

export class GeneratedReport {
  private _status: ReportStatus;
  private _storageUrl: string | null;

  constructor(
    public readonly id: string,
    public readonly caseId: string,
    public readonly reportType: ReportType,
    public readonly requestedBy: string,
    status: ReportStatus = ReportStatus.PENDING,
    storageUrl: string | null = null,
    public readonly requestedAt: Date = new Date(),
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('GeneratedReport id cannot be empty');
    }
    if (!caseId || caseId.trim().length === 0) {
      throw new Error('caseId cannot be empty');
    }
    this._status = status;
    this._storageUrl = storageUrl;
  }

  get status(): ReportStatus {
    return this._status;
  }

  get storageUrl(): string | null {
    return this._storageUrl;
  }

  markAsGenerated(storageUrl: string): void {
    if (!storageUrl || storageUrl.trim().length === 0) {
      throw new Error('storageUrl cannot be empty');
    }
    this._status = ReportStatus.GENERATED;
    this._storageUrl = storageUrl;
  }

  markAsFailed(): void {
    this._status = ReportStatus.FAILED;
  }
}
