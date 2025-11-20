export declare abstract class BaseEntity {
    readonly id: string;
    readonly createdAt: Date;
    updatedAt: Date;
    constructor(id?: string);
    equals(entity: BaseEntity): boolean;
    protected touch(): void;
}
//# sourceMappingURL=base-entity.d.ts.map