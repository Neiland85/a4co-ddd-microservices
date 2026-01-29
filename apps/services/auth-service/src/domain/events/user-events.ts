import { DomainEvent } from '@a4co/shared-utils';

interface AuthEventPayloadBase {
  timestamp: Date;
}

abstract class AuthDomainEvent<TPayload extends AuthEventPayloadBase> extends DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly eventName: string,
    public readonly payload: TPayload,
    public readonly eventVersion: number = 1,
  ) {
    super(undefined, payload.timestamp);
  }
}

export interface UserRegisteredPayload extends AuthEventPayloadBase {
  email: string;
  name: string;
  registeredAt: Date;
}

export class UserRegisteredEvent extends AuthDomainEvent<UserRegisteredPayload> {
  constructor(aggregateId: string, payload: Omit<UserRegisteredPayload, 'timestamp'>) {
    super(aggregateId, 'UserRegistered', { ...payload, timestamp: payload.registeredAt }, 1);
  }
}

export interface UserLoginPayload extends AuthEventPayloadBase {
  email: string;
  loginAt: Date;
  ip?: string;
  userAgent?: string;
}

export class UserLoginEvent extends AuthDomainEvent<UserLoginPayload> {
  constructor(aggregateId: string, payload: Omit<UserLoginPayload, 'timestamp'>) {
    super(aggregateId, 'UserLogin', { ...payload, timestamp: payload.loginAt }, 1);
  }
}

export interface UserPasswordChangedPayload extends AuthEventPayloadBase {
  changedAt: Date;
  changedBy: string;
}

export class UserPasswordChangedEvent extends AuthDomainEvent<UserPasswordChangedPayload> {
  constructor(aggregateId: string, payload: Omit<UserPasswordChangedPayload, 'timestamp'>) {
    super(aggregateId, 'UserPasswordChanged', { ...payload, timestamp: payload.changedAt }, 1);
  }
}

export interface UserDeactivatedPayload extends AuthEventPayloadBase {
  deactivatedAt: Date;
  reason?: string;
  deactivatedBy: string;
}

export class UserDeactivatedEvent extends AuthDomainEvent<UserDeactivatedPayload> {
  constructor(aggregateId: string, payload: Omit<UserDeactivatedPayload, 'timestamp'>) {
    super(aggregateId, 'UserDeactivated', { ...payload, timestamp: payload.deactivatedAt }, 1);
  }
}
