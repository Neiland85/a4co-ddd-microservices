/**
 * User Domain Events
 *
 * Eventos de dominio que representan cambios importantes en el ciclo de vida del usuario
 */

export interface DomainEventMetadata {
  aggregateId: string;
  occurredOn: Date;
  eventVersion: number;
}

/**
 * UserCreatedEvent
 * Se dispara cuando un nuevo usuario es creado
 */
export class UserCreatedEvent {
  readonly eventName = 'user.created.v1';
  readonly occurredOn: Date;
  readonly eventVersion = 1;

  constructor(
    public readonly aggregateId: string,
    public readonly username: string,
    public readonly email: string,
  ) {
    this.occurredOn = new Date();
  }
}

/**
 * UserUpdatedEvent
 * Se dispara cuando un usuario es actualizado
 */
export class UserUpdatedEvent {
  readonly eventName = 'user.updated.v1';
  readonly occurredOn: Date;
  readonly eventVersion = 1;

  constructor(
    public readonly aggregateId: string,
    public readonly changes: {
      field: string;
      oldValue: unknown;
      newValue: unknown;
    },
  ) {
    this.occurredOn = new Date();
  }
}

/**
 * UserActivatedEvent
 * Se dispara cuando un usuario inactivo es activado
 */
export class UserActivatedEvent {
  readonly eventName = 'user.activated.v1';
  readonly occurredOn: Date;
  readonly eventVersion = 1;

  constructor(public readonly aggregateId: string) {
    this.occurredOn = new Date();
  }
}

/**
 * UserDeactivatedEvent
 * Se dispara cuando un usuario activo es desactivado
 */
export class UserDeactivatedEvent {
  readonly eventName = 'user.deactivated.v1';
  readonly occurredOn: Date;
  readonly eventVersion = 1;

  constructor(public readonly aggregateId: string) {
    this.occurredOn = new Date();
  }
}
