export declare abstract class BaseValueObject<T> {
    protected readonly _value: T;
    constructor(value: T);
    get value(): T;
    protected abstract ensureValidState(): void;
    equals(other: BaseValueObject<T>): boolean;
    toString(): string;
    valueOf(): T;
}
//# sourceMappingURL=base-value-object.d.ts.map