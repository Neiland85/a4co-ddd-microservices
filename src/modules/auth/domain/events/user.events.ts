/**
 * Domain Event: UserRegisteredEvent
 * Se emite cuando un nuevo usuario se registra en el sistema
 */
export class UserRegisteredEvent {
  public readonly eventName = 'user.registered';
  public readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly data: {
      email: string;
      name: string;
      registeredAt: Date;
    },
  ) {
    this.occurredOn = new Date();
  }
}

/**
 * Domain Event: UserLoginEvent
 * Se emite cuando un usuario inicia sesión
 */
export class UserLoginEvent {
  public readonly eventName = 'user.login';
  public readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly data: {
      email: string;
      loginAt: Date;
      ip?: string;
      userAgent?: string;
    },
  ) {
    this.occurredOn = new Date();
  }
}

/**
 * Domain Event: UserPasswordChangedEvent
 * Se emite cuando un usuario cambia su contraseña
 */
export class UserPasswordChangedEvent {
  public readonly eventName = 'user.password.changed';
  public readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly data: {
      changedAt: Date;
      changedBy: string;
    },
  ) {
    this.occurredOn = new Date();
  }
}

/**
 * Domain Event: UserDeactivatedEvent
 * Se emite cuando un usuario es desactivado
 */
export class UserDeactivatedEvent {
  public readonly eventName = 'user.deactivated';
  public readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly data: {
      deactivatedAt: Date;
      reason?: string;
      deactivatedBy?: string;
    },
  ) {
    this.occurredOn = new Date();
  }
}
