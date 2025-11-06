import { ValueObject } from '../base-classes';

/**
 * Value Object para representar valores monetarios
 */
export class Money extends ValueObject<{ amount: number; currency: string }> {
    constructor(amount: number, currency: string = 'EUR') {
        if (amount < 0) {
            throw new Error('Money amount cannot be negative');
        }
        if (!currency || currency.trim().length === 0) {
            throw new Error('Currency cannot be empty');
        }
        if (currency.length !== 3) {
            throw new Error('Currency must be a 3-letter ISO code (e.g., EUR, USD)');
        }

        super({ amount, currency: currency.toUpperCase() });
    }

    get amount(): number {
        return this.value.amount;
    }

    get currency(): string {
        return this.value.currency;
    }

    /**
     * Suma dos valores monetarios (deben tener la misma moneda)
     */
    add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error(`Cannot add money with different currencies: ${this.currency} and ${other.currency}`);
        }
        return new Money(this.amount + other.amount, this.currency);
    }

    /**
     * Resta dos valores monetarios (deben tener la misma moneda)
     */
    subtract(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error(`Cannot subtract money with different currencies: ${this.currency} and ${other.currency}`);
        }
        if (this.amount < other.amount) {
            throw new Error('Resulting amount would be negative');
        }
        return new Money(this.amount - other.amount, this.currency);
    }

    /**
     * Multiplica el valor por un factor
     */
    multiply(factor: number): Money {
        if (factor < 0) {
            throw new Error('Multiplication factor cannot be negative');
        }
        return new Money(this.amount * factor, this.currency);
    }

    /**
     * Compara dos valores monetarios
     */
    equals(other: Money): boolean {
        return this.amount === other.amount && this.currency === other.currency;
    }

    /**
     * Verifica si el valor es mayor que otro
     */
    isGreaterThan(other: Money): boolean {
        if (this.currency !== other.currency) {
            throw new Error(`Cannot compare money with different currencies: ${this.currency} and ${other.currency}`);
        }
        return this.amount > other.amount;
    }

    /**
     * Verifica si el valor es menor que otro
     */
    isLessThan(other: Money): boolean {
        if (this.currency !== other.currency) {
            throw new Error(`Cannot compare money with different currencies: ${this.currency} and ${other.currency}`);
        }
        return this.amount < other.amount;
    }

    /**
     * Convierte a número (para compatibilidad con código existente)
     */
    toNumber(): number {
        return this.amount;
    }

    /**
     * Representación en string
     */
    toString(): string {
        return `${this.amount.toFixed(2)} ${this.currency}`;
    }
}
