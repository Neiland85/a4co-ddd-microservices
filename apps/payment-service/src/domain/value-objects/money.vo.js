"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
const shared_utils_1 = require("@a4co/shared-utils");
const ISO_CURRENCY_REGEX = /^[A-Z]{3}$/;
class Money extends shared_utils_1.ValueObject {
    static { this.MIN_AMOUNT = 0.01; }
    constructor(amount, currency) {
        Money.ensureValidAmount(amount);
        Money.ensureValidCurrency(currency);
        const normalizedCurrency = currency.toUpperCase();
        const roundedAmount = Money.round(amount);
        super({ amount: roundedAmount, currency: normalizedCurrency });
    }
    static create(amount, currency = 'USD') {
        return new Money(amount, currency);
    }
    static fromPrimitives(primitives) {
        return Money.create(primitives.amount, primitives.currency);
    }
    get amount() {
        return this.value.amount;
    }
    get currency() {
        return this.value.currency;
    }
    add(other) {
        this.ensureSameCurrency(other);
        return Money.create(this.amount + other.amount, this.currency);
    }
    subtract(other) {
        this.ensureSameCurrency(other);
        const result = this.amount - other.amount;
        if (result < Money.MIN_AMOUNT) {
            throw new Error('Resulting money amount cannot be less than minimum allowed');
        }
        return Money.create(result, this.currency);
    }
    multiply(multiplier) {
        if (multiplier <= 0) {
            throw new Error('Money multiplier must be greater than zero');
        }
        return Money.create(this.amount * multiplier, this.currency);
    }
    equals(other) {
        return this.currency === other.currency && this.amount === other.amount;
    }
    toPrimitives() {
        return {
            amount: this.amount,
            currency: this.currency,
        };
    }
    static ensureValidAmount(amount) {
        if (typeof amount !== 'number' || Number.isNaN(amount)) {
            throw new Error('Money amount must be a valid number');
        }
        if (!Number.isFinite(amount)) {
            throw new Error('Money amount must be finite');
        }
        if (amount < Money.MIN_AMOUNT) {
            throw new Error('Money amount must be greater than zero');
        }
    }
    static ensureValidCurrency(currency) {
        if (!currency || !ISO_CURRENCY_REGEX.test(currency.toUpperCase())) {
            throw new Error('Currency must be a valid ISO 4217 3-letter code');
        }
    }
    ensureSameCurrency(other) {
        if (this.currency !== other.currency) {
            throw new Error('Money operations require matching currencies');
        }
    }
    static round(amount) {
        return Math.round((amount + Number.EPSILON) * 100) / 100;
    }
}
exports.Money = Money;
//# sourceMappingURL=money.vo.js.map