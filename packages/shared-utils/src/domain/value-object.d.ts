export declare abstract class ValueObject<T> {
    protected readonly _value: T;
    constructor(value: T);
    get value(): T;
    equals(vo: ValueObject<T>): boolean;
    toString(): string;
}
//# sourceMappingURL=value-object.d.ts.map