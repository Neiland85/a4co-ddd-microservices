
export class Money {
	public readonly amount: number;
	public readonly currency: string;

	constructor(amount: number, currency: string = 'EUR') {
		if (!Number.isFinite(amount)) {
			throw new Error('Money amount must be a finite number');
		}
		if (!currency || currency.trim().length === 0) {
			throw new Error('Money currency cannot be empty');
		}

		this.amount = amount;
		this.currency = currency;
	}
}

