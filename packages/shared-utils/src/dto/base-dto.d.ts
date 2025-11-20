export declare abstract class BaseDto {
    toJSON(): Record<string, any>;
    static fromJSON<T extends BaseDto>(this: new () => T, json: Record<string, any>): T;
}
//# sourceMappingURL=base-dto.d.ts.map