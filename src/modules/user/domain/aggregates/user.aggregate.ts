import { v4 as uuidv4 } from 'uuid';
import { Email } from '../value-objects/email.vo';
import { Username } from '../value-objects/username.vo';
import {
  UserCreatedEvent,
  UserUpdatedEvent,
  UserActivatedEvent,
  UserDeactivatedEvent,
} from '../events/user.events';

/**
 * User Aggregate Root
 *
 * Representa un usuario en el sistema con toda su lógica de negocio
 *
 * Invariantes:
 * - Email y username deben ser únicos (validado en capa de aplicación)
 * - Username debe cumplir formato válido
 * - Email debe cumplir formato válido
 */
export class User {
  private _id: string;
  private _username: Username;
  private _email: Email;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _domainEvents: Array<
    UserCreatedEvent | UserUpdatedEvent | UserActivatedEvent | UserDeactivatedEvent
  > = [];

  private constructor(
    id: string,
    username: Username,
    email: Email,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._username = username;
    this._email = email;
    this._isActive = isActive;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  /**
   * Crea un nuevo usuario (factory method para nuevos usuarios)
   */
  static create(username: string, email: string): User {
    const usernameVO = Username.create(username);
    const emailVO = Email.create(email);
    const id = uuidv4();
    const now = new Date();

    const user = new User(id, usernameVO, emailVO, true, now, now);

    // Registrar evento de dominio
    user.addDomainEvent(new UserCreatedEvent(id, usernameVO.value, emailVO.value));

    return user;
  }

  /**
   * Reconstruye un usuario desde la base de datos (factory method para persistencia)
   */
  static reconstruct(
    id: string,
    username: string,
    email: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    const usernameVO = Username.create(username);
    const emailVO = Email.create(email);

    return new User(id, usernameVO, emailVO, isActive, createdAt, updatedAt);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get username(): string {
    return this._username.value;
  }

  get email(): string {
    return this._email.value;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Actualiza el username del usuario
   */
  updateUsername(newUsername: string): void {
    const newUsernameVO = Username.create(newUsername);

    if (this._username.equals(newUsernameVO)) {
      return; // No cambió nada
    }

    const oldUsername = this._username.value;
    this._username = newUsernameVO;
    this.touch();

    this.addDomainEvent(
      new UserUpdatedEvent(this._id, {
        field: 'username',
        oldValue: oldUsername,
        newValue: newUsernameVO.value,
      }),
    );
  }

  /**
   * Actualiza el email del usuario
   */
  updateEmail(newEmail: string): void {
    const newEmailVO = Email.create(newEmail);

    if (this._email.equals(newEmailVO)) {
      return; // No cambió nada
    }

    const oldEmail = this._email.value;
    this._email = newEmailVO;
    this.touch();

    this.addDomainEvent(
      new UserUpdatedEvent(this._id, {
        field: 'email',
        oldValue: oldEmail,
        newValue: newEmailVO.value,
      }),
    );
  }

  /**
   * Activa un usuario previamente desactivado
   */
  activate(): void {
    if (this._isActive) {
      throw new Error('El usuario ya está activo');
    }

    this._isActive = true;
    this.touch();

    this.addDomainEvent(new UserActivatedEvent(this._id));
  }

  /**
   * Desactiva un usuario activo
   */
  deactivate(): void {
    if (!this._isActive) {
      throw new Error('El usuario ya está inactivo');
    }

    this._isActive = false;
    this.touch();

    this.addDomainEvent(new UserDeactivatedEvent(this._id));
  }

  /**
   * Actualiza la fecha de modificación
   */
  private touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * Agrega un evento de dominio
   */
  private addDomainEvent(
    event: UserCreatedEvent | UserUpdatedEvent | UserActivatedEvent | UserDeactivatedEvent,
  ): void {
    this._domainEvents.push(event);
  }

  /**
   * Obtiene los eventos de dominio pendientes
   */
  getUncommittedEvents(): Array<
    UserCreatedEvent | UserUpdatedEvent | UserActivatedEvent | UserDeactivatedEvent
  > {
    return [...this._domainEvents];
  }

  /**
   * Limpia los eventos de dominio después de procesarlos
   */
  clearEvents(): void {
    this._domainEvents = [];
  }
}
