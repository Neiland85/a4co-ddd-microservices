import { HashRecord } from '../value-objects/hash-record.vo';
import { HashService } from '../services/hash.service';

export class EvidenceFile {
  readonly id: string;
  readonly filename: string;
  readonly content: string;
  readonly hashRecord: HashRecord;

  private constructor(id: string, filename: string, content: string, hashRecord: HashRecord) {
    this.id = id;
    this.filename = filename;
    this.content = content;
    this.hashRecord = hashRecord;
  }

  static create(filename: string, content: string, hashService: HashService): EvidenceFile {
    const hashRecord = hashService.generateHashRecord(content);
    return new EvidenceFile(hashRecord.id, filename, content, hashRecord);
import { HashRecord } from '../value-objects/hash-record.vo.js';

export enum EvidenceFileStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export class EvidenceFile {
  private _hashRecord: HashRecord | null;
  private _status: EvidenceFileStatus;

  constructor(
    public readonly id: string,
    public readonly evidenceId: string,
    public readonly fileName: string,
    public readonly mimeType: string,
    public readonly sizeBytes: number,
    public readonly storageUrl: string,
    hashRecord: HashRecord | null = null,
    status: EvidenceFileStatus = EvidenceFileStatus.PENDING_VERIFICATION,
    public readonly uploadedAt: Date = new Date(),
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('EvidenceFile id cannot be empty');
    }
    if (!fileName || fileName.trim().length === 0) {
      throw new Error('EvidenceFile fileName cannot be empty');
    }
    if (sizeBytes < 0) {
      throw new Error('EvidenceFile sizeBytes cannot be negative');
    }
    this._hashRecord = hashRecord;
    this._status = status;
  }

  get hashRecord(): HashRecord | null {
    return this._hashRecord;
  }

  get status(): EvidenceFileStatus {
    return this._status;
  }

  attachHash(hash: HashRecord): void {
    this._hashRecord = hash;
    this._status = EvidenceFileStatus.VERIFIED;
  }

  reject(): void {
    this._status = EvidenceFileStatus.REJECTED;
  }
}
