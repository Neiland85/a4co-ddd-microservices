export class ChainOfCustodyEvent {
  constructor(
    public readonly id: string,
    public readonly evidenceId: string,
    public readonly fromCustodian: string | null,
    public readonly toCustodian: string,
    public readonly reason: string,
    public readonly occurredAt: Date = new Date(),
    public readonly recordedBy: string,
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
  }
}
