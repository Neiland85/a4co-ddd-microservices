import type { DomainEvent } from '@a4co/shared-utils';

export class UserRegisteredEvent implements DomainEvent {
  readonly eventName = 'UserRegistered';
  readonly occurredOn = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      email: string;
      name: string;
      registeredAt: Date;
    },
  ) {}
}

export class UserLoginEvent implements DomainEvent {
  readonly eventName = 'UserLogin';
  readonly occurredOn = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      email: string;
      loginAt: Date;
      ip?: string;
      userAgent?: string;
    },
  ) {}
}

export class UserPasswordChangedEvent implements DomainEvent {
  readonly eventName = 'UserPasswordChanged';
  readonly occurredOn = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      changedAt: Date;
      changedBy: string;
    },
  ) {}
}

export class UserDeactivatedEvent implements DomainEvent {
  readonly eventName = 'UserDeactivated';
  readonly occurredOn = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      deactivatedAt: Date;
      reason?: string;
      deactivatedBy: string;
    },
  ) {}
}
