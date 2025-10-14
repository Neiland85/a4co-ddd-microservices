import { ValueObject } from '@a4co/shared-utils';
export declare class ProductId extends ValueObject<string> {
    constructor(value?: string);
    static fromString(value: string): ProductId;
}
export declare class ProductName extends ValueObject<string> {
    constructor(value: string);
}
export declare class ProductDescription extends ValueObject<string> {
    constructor(value: string);
}
export declare class Price extends ValueObject<{
    amount: number;
    currency: string;
}> {
    constructor(amount: number, currency: string);
    get amount(): number;
    get currency(): string;
    add(other: Price): Price;
    multiply(factor: number): Price;
}
export declare class CategoryId extends ValueObject<string> {
    constructor(value: string);
}
export declare class SKU extends ValueObject<string> {
    constructor(value: string);
}
//# sourceMappingURL=product-value-objects.d.ts.map