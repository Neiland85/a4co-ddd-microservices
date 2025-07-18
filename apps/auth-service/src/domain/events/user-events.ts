import { DomainEvent } from '@shared/index';

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userData: {
      email: string;
      name: string;
      registeredAt: Date;
    },
    eventVersion?: number
  ) {
    super(aggregateId, userData, eventVersion);
  }
}

export class UserLoginEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly loginData: {
      email: string;
      loginAt: Date;
      ip?: string;
      userAgent?: string;
    },
    eventVersion?: number
  ) {
    super(aggregateId, loginData, eventVersion);
  }
}

export class UserPasswordChangedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly passwordData: {
      changedAt: Date;
      changedBy: string;
    },
    eventVersion?: number
  ) {
    super(aggregateId, passwordData, eventVersion);
  }
}

export class UserDeactivatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly deactivationData: {
      deactivatedAt: Date;
      reason?: string;
      deactivatedBy: string;
    },
    eventVersion?: number
  ) {
    super(aggregateId, deactivationData, eventVersion);
  }
}
