import { AggregateRoot } from '../base-classes.js';
import { Party, PartyRole } from '../entities/party.entity.js';
import { GeneratedReport, ReportType } from '../entities/generated-report.entity.js';
import { CaseOpenedEvent } from '../events/index.js';

export enum CaseStatus {
  OPEN = 'OPEN',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export class LegalCase extends AggregateRoot {
  private _title: string;
  private _description: string;
  private _status: CaseStatus;
  private _tenantId: string;
  private _parties: Party[];
  private _reports: GeneratedReport[];
  private _openedBy: string;

  constructor(
    id: string,
    title: string,
    description: string,
    openedBy: string,
    status: CaseStatus = CaseStatus.OPEN,
    parties: Party[] = [],
    reports: GeneratedReport[] = [],
    createdAt?: Date,
    updatedAt?: Date,
    tenantId = 'default',
  ) {
    super(id, createdAt, updatedAt);
    if (!title || title.trim().length === 0) {
      throw new Error('Case title cannot be empty');
    }
    this._title = title;
    this._description = description;
    this._status = status;
    this._openedBy = openedBy;
    this._tenantId = tenantId;
    this._parties = [...parties];
    this._reports = [...reports];

    if (status === CaseStatus.OPEN && !createdAt) {
      this.addDomainEvent(new CaseOpenedEvent(id, title, openedBy));
    }
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get status(): CaseStatus {
    return this._status;
  }

  get tenantId(): string {
    return this._tenantId;
  }

  get openedBy(): string {
    return this._openedBy;
  }

  get parties(): Party[] {
    return [...this._parties];
  }

  get reports(): GeneratedReport[] {
    return [...this._reports];
  }

  addParty(party: Party): void {
    if (this._status === CaseStatus.CLOSED || this._status === CaseStatus.ARCHIVED) {
      throw new Error(`Cannot add party to a ${this._status} case`);
    }
    const exists = this._parties.some((p) => p.id === party.id);
    if (exists) {
      throw new Error(`Party ${party.id} is already part of this case`);
    }
    this._parties.push(party);
    this.touch();
  }

  removeParty(partyId: string): void {
    const index = this._parties.findIndex((p) => p.id === partyId);
    if (index === -1) {
      throw new Error(`Party ${partyId} not found in case`);
    }
    this._parties.splice(index, 1);
    this.touch();
  }

  addReport(report: GeneratedReport): void {
    this._reports.push(report);
    this.touch();
  }

  changeStatus(newStatus: CaseStatus): void {
    if (this._status === newStatus) {
      return;
    }
    this._status = newStatus;
    this.touch();
  }

  close(): void {
    if (this._status === CaseStatus.CLOSED) {
      throw new Error('Case is already closed');
    }
    this.changeStatus(CaseStatus.CLOSED);
  }

  archive(): void {
    if (this._status !== CaseStatus.CLOSED) {
      throw new Error('Only closed cases can be archived');
    }
    this.changeStatus(CaseStatus.ARCHIVED);
  }

  static create(
    id: string,
    title: string,
    description: string,
    openedBy: string,
    tenantId = 'default',
  ): LegalCase {
    return new LegalCase(id, title, description, openedBy, CaseStatus.OPEN, [], [], undefined, undefined, tenantId);
  }
}

// Re-export for convenience
export { PartyRole };
