import { AggregateRoot } from '@a4co/shared-utils';
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class User extends AggregateRoot {
    private readonly _email;
    private readonly _name;
    private _hashedPassword;
    private _status;
    private _emailVerified;
    private _lastLoginAt?;
    private constructor();
    static create(email: string, name: string, password: string, id?: string): Promise<User>;
    static createWithHashedPassword(email: string, name: string, hashedPassword: string, id?: string): Promise<User>;
    static reconstruct(identifiers: {
        id: string;
        email: string;
        name: string;
    }, credentials: {
        hashedPassword: string;
        status: UserStatus;
        emailVerified: boolean;
    }, timestamps: {
        lastLoginAt?: Date;
        createdAt?: Date;
        updatedAt?: Date;
    }, data: {
        id: string;
        email: string;
        name: string;
        hashedPassword: string;
        status: UserStatus;
        emailVerified: boolean;
        lastLoginAt?: Date;
        createdAt?: Date;
        updatedAt?: Date;
    }): User;
    get email(): string;
    get name(): string;
    get status(): UserStatus;
    get emailVerified(): boolean;
    get lastLoginAt(): Date | undefined;
    get hashedPassword(): string;
    validatePassword(password: string): Promise<boolean>;
    recordLogin(ip?: string, userAgent?: string): void;
    changePassword(currentPassword: string, newPassword: string, changedBy: string): Promise<void>;
    verifyEmail(): void;
    deactivate(reason?: string, deactivatedBy?: string): void;
    activate(): void;
    suspend(): void;
    toPersistence(): {
        id: string;
        email: string;
        name: string;
        hashedPassword: string;
        status: UserStatus;
        emailVerified: boolean;
        lastLoginAt?: Date;
        createdAt: Date;
        updatedAt: Date;
    };
}
//# sourceMappingURL=user.aggregate.d.ts.map