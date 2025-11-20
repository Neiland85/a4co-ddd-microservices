import { ValueObject } from '@a4co/shared-utils';
export interface MoneyPrimitives {
    amount: number;
    currency: string;
}
export declare class Money extends ValueObject<MoneyPrimitives> {
    private static readonly MIN_AMOUNT;
    private constructor();
    static create(amount: number, currency?: string): Money;
    static fromPrimitives(primitives: MoneyPrimitives): Money;
    get amount(): number;
    get currency(): string;
    add(other: Money): Money;
    subtract(other: Money): Money;
    multiply(multiplier: number): Money;
    equals(other: Money): boolean;
    toPrimitives(): MoneyPrimitives;
    private static ensureValidAmount;
    private static ensureValidCurrency;
    private ensureSameCurrency;
    private static round;
}
//# sourceMappingURL=money.vo.d.ts.map