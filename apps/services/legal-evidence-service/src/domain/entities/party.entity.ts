export enum PartyRole {
  PLAINTIFF = 'PLAINTIFF',
  DEFENDANT = 'DEFENDANT',
  WITNESS = 'WITNESS',
  EXPERT = 'EXPERT',
  ATTORNEY = 'ATTORNEY',
  JUDGE = 'JUDGE',
}

export class Party {
  constructor(
    public readonly id: string,
    public readonly caseId: string,
    public readonly name: string,
    public readonly role: PartyRole,
    public readonly contactEmail: string | null,
    public readonly createdAt: Date = new Date(),
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('Party id cannot be empty');
    }
    if (!name || name.trim().length === 0) {
      throw new Error('Party name cannot be empty');
    }
  }
}
