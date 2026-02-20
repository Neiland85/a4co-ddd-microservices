export enum CustodyEventType {
  CUSTODY_TRANSFER = 'CUSTODY_TRANSFER',
  EVIDENCE_FILE_UPLOADED = 'EVIDENCE_FILE_UPLOADED',
  EVIDENCE_HASHED = 'EVIDENCE_HASHED',
  EVIDENCE_REVIEWED = 'EVIDENCE_REVIEWED',
  EVIDENCE_SEALED = 'EVIDENCE_SEALED',
  EVIDENCE_ACCESSED = 'EVIDENCE_ACCESSED',
}

export class ChainOfCustodyEvent {
  constructor(
    public readonly id: string,
    public readonly evidenceId: string,
    public readonly fromCustodian: string | null,
    public readonly toCustodian: string,
    public readonly reason: string,
    public readonly recordedBy: string,
    public readonly eventType: CustodyEventType = CustodyEventType.CUSTODY_TRANSFER,
    public readonly occurredAt: Date = new Date(),
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('ChainOfCustodyEvent id cannot be empty');
    }
    if (!toCustodian || toCustodian.trim().length === 0) {
      throw new Error('toCustodian cannot be empty');
    }
    if (!reason || reason.trim().length === 0) {
      throw new Error('reason cannot be empty');
    }
    if (!recordedBy || recordedBy.trim().length === 0) {
      throw new Error('recordedBy cannot be empty');
    }
    Object.freeze(this);
  }
}
