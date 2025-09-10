import { DomainEvent } from '@a4co/shared-utils';
export declare class UserRegisteredEvent extends DomainEvent {
    readonly userData: {
        email: string;
        name: string;
        registeredAt: Date;
    };
    constructor(aggregateId: string, userData: {
        email: string;
        name: string;
        registeredAt: Date;
    }, eventVersion?: number);
}
export declare class UserLoginEvent extends DomainEvent {
    readonly loginData: {
        email: string;
        loginAt: Date;
        ip?: string;
        userAgent?: string;
    };
    constructor(aggregateId: string, loginData: {
        email: string;
        loginAt: Date;
        ip?: string;
        userAgent?: string;
    }, eventVersion?: number);
}
export declare class UserPasswordChangedEvent extends DomainEvent {
    readonly passwordData: {
        changedAt: Date;
        changedBy: string;
    };
    constructor(aggregateId: string, passwordData: {
        changedAt: Date;
        changedBy: string;
    }, eventVersion?: number);
}
export declare class UserDeactivatedEvent extends DomainEvent {
    readonly deactivationData: {
        deactivatedAt: Date;
        reason?: string;
        deactivatedBy?: string;
    };
    constructor(aggregateId: string, deactivationData: {
        deactivatedAt: Date;
        reason?: string;
        deactivatedBy?: string;
    }, eventVersion?: number);
}
//# sourceMappingURL=user-events.d.ts.map