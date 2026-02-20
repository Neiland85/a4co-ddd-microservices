import { randomUUID } from 'crypto';
import { AggregateRoot } from '../base-classes.js';
import { EvidenceFile } from '../entities/evidence-file.entity.js';
import { ChainOfCustodyEvent, CustodyEventType } from '../entities/chain-of-custody-event.entity.js';
import { EvidenceSubmittedEvent, CustodyTransferredEvent } from '../events/index.js';
import { HashRecord } from '../value-objects/hash-record.vo.js';
import { ChainOfCustodyEvent } from '../entities/chain-of-custody-event.entity.js';
import {
  EvidenceSubmittedEvent,
  CustodyTransferredEvent,
  EvidenceExportedEvent,
} from '../events/index.js';

export enum EvidenceType {
  DOCUMENT = 'DOCUMENT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DIGITAL = 'DIGITAL',
  PHYSICAL = 'PHYSICAL',
}

export enum EvidenceStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class Evidence extends AggregateRoot {
  private _title: string;
  private _description: string;
  private _evidenceType: EvidenceType;
  private _status: EvidenceStatus;
  private _caseId: string;
  private _tenantId: string;
  private _submittedBy: string;
  private _files: EvidenceFile[];
  private _custodyChain: ChainOfCustodyEvent[];

  constructor(
    id: string,
    title: string,
    description: string,
    evidenceType: EvidenceType,
    caseId: string,
    submittedBy: string,
    status: EvidenceStatus = EvidenceStatus.SUBMITTED,
    files: EvidenceFile[] = [],
    custodyChain: ChainOfCustodyEvent[] = [],
    createdAt?: Date,
    updatedAt?: Date,
    tenantId = 'default',
  ) {
    super(id, createdAt, updatedAt);
    if (!title || title.trim().length === 0) {
      throw new Error('Evidence title cannot be empty');
    }
    if (!caseId || caseId.trim().length === 0) {
      throw new Error('Evidence caseId cannot be empty');
    }
    this._title = title;
    this._description = description;
    this._evidenceType = evidenceType;
    this._status = status;
    this._caseId = caseId;
    this._tenantId = tenantId;
    this._submittedBy = submittedBy;
    this._files = [...files];
    this._custodyChain = [...custodyChain];

    if (status === EvidenceStatus.SUBMITTED && !createdAt) {
      this.addDomainEvent(new EvidenceSubmittedEvent(id, caseId, title, submittedBy));
    }
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get evidenceType(): EvidenceType {
    return this._evidenceType;
  }

  get status(): EvidenceStatus {
    return this._status;
  }

  get caseId(): string {
    return this._caseId;
  }

  get tenantId(): string {
    return this._tenantId;
  }

  get submittedBy(): string {
    return this._submittedBy;
  }

  get files(): EvidenceFile[] {
    return [...this._files];
  }

  get custodyChain(): ChainOfCustodyEvent[] {
    return [...this._custodyChain];
  }

  addFile(file: EvidenceFile): void {
    if (this._status === EvidenceStatus.REJECTED) {
      throw new Error('Cannot add files to rejected evidence');
    }
    const exists = this._files.some((f) => f.id === file.id);
    if (exists) {
      throw new Error(`File ${file.id} is already attached to this evidence`);
    }
    this._files.push(file);
    this.touch();
  }

  transferCustody(event: ChainOfCustodyEvent): void {
    this._custodyChain.push(event);
    this.touch();
    this.addDomainEvent(
      new CustodyTransferredEvent(
        event.id,
        this._id,
        event.fromCustodian,
        event.toCustodian,
        event.reason,
      ),
    );
  }

  uploadFile(file: EvidenceFile, sha256Hash: string, uploadedBy: string): void {
    if (this._status === EvidenceStatus.REJECTED) {
      throw new Error('Cannot add files to rejected evidence');
    }
    const exists = this._files.some((f) => f.id === file.id);
    if (exists) {
      throw new Error(`File ${file.id} is already attached to this evidence`);
    }

    const hashRecord = new HashRecord('SHA-256', sha256Hash);
    file.attachHash(hashRecord);
    this._files.push(file);

    const now = new Date();

    this._custodyChain.push(
      new ChainOfCustodyEvent(
        randomUUID(),
        this._id,
        null,
        uploadedBy,
        `File ${file.fileName} uploaded`,
        uploadedBy,
        CustodyEventType.EVIDENCE_FILE_UPLOADED,
        now,
      ),
    );

    this._custodyChain.push(
      new ChainOfCustodyEvent(
        randomUUID(),
        this._id,
        null,
        uploadedBy,
        `SHA-256 hash computed for ${file.fileName}: ${sha256Hash}`,
        uploadedBy,
        CustodyEventType.EVIDENCE_HASHED,
        now,
      ),
    );

    this.touch();
  }

  get currentCustodian(): string | null {
    if (this._custodyChain.length === 0) {
      return null;
    }
    return this._custodyChain[this._custodyChain.length - 1].toCustodian;
  }

  accept(): void {
    if (this._status !== EvidenceStatus.UNDER_REVIEW) {
      throw new Error('Only evidence under review can be accepted');
    }
    this._status = EvidenceStatus.ACCEPTED;
    this.touch();
  }

  reject(): void {
    if (this._status === EvidenceStatus.REJECTED) {
      throw new Error('Evidence is already rejected');
    }
    this._status = EvidenceStatus.REJECTED;
    this.touch();
  }

  startReview(): void {
    if (this._status !== EvidenceStatus.SUBMITTED) {
      throw new Error('Only submitted evidence can be put under review');
    }
    this._status = EvidenceStatus.UNDER_REVIEW;
    this.touch();
  }

  static create(
    id: string,
    title: string,
    description: string,
    evidenceType: EvidenceType,
    caseId: string,
    submittedBy: string,
    tenantId = 'default',
  ): Evidence {
    return new Evidence(
      id,
      title,
      description,
      evidenceType,
      caseId,
      submittedBy,
      EvidenceStatus.SUBMITTED,
      [],
      [],
      undefined,
      undefined,
      tenantId,
    );
  }

  recordExport(exportedBy: string, packageHash: string): void {
    const custodyEvent = new ChainOfCustodyEvent(
      randomUUID(),
      this._id,
      this.currentCustodian,
      exportedBy,
      'EVIDENCE_EXPORTED',
      new Date(),
      exportedBy,
    );
    this._custodyChain.push(custodyEvent);
    this.touch();
    this.addDomainEvent(
      new EvidenceExportedEvent(this._id, this._caseId, exportedBy, packageHash),
    );
  }
}
