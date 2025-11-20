import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Email, Password, UserName } from '../value-objects';
import {
  UserRegisteredEvent,
  UserLoginEvent,
  UserPasswordChangedEvent,
  UserDeactivatedEvent,
} from '../events';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

/**
 * User Aggregate
 * Representa un usuario del sistema con sus reglas de negocio
 */
export class User {
  private domainEvents: any[] = [];
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(
    public readonly id: string,
    private readonly _email: Email,
    private readonly _name: UserName,
    private _hashedPassword: string,
    private _status: UserStatus = UserStatus.ACTIVE,
    private _emailVerified: boolean = false,
    private _lastLoginAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // ==================== Factory Methods ====================

  /**
   * Crea un nuevo usuario con password sin hashear
   */
  public static async create(
    email: string,
    name: string,
    password: string,
    id?: string,
  ): Promise<User> {
    const emailVO = new Email(email);
    const nameVO = new UserName(name);
    const passwordVO = new Password(password);

    const hashedPassword = await bcrypt.hash(passwordVO.value, 12);
    const userId = id || uuidv4();

    const user = new User(userId, emailVO, nameVO, hashedPassword);

    user.addDomainEvent(
      new UserRegisteredEvent(user.id, {
        email: emailVO.value,
        name: nameVO.value,
        registeredAt: user.createdAt,
      }),
    );

    return user;
  }

  /**
   * Crea un usuario con password ya hasheada (para repositorio)
   */
  public static async createWithHashedPassword(
    email: string,
    name: string,
    hashedPassword: string,
    id?: string,
  ): Promise<User> {
    const emailVO = new Email(email);
    const nameVO = new UserName(name);
    const userId = id || uuidv4();

    const user = new User(userId, emailVO, nameVO, hashedPassword);

    user.addDomainEvent(
      new UserRegisteredEvent(user.id, {
        email: emailVO.value,
        name: nameVO.value,
        registeredAt: user.createdAt,
      }),
    );

    return user;
  }

  /**
   * Reconstruye un usuario desde persistencia
   */
  public static reconstruct(data: {
    id: string;
    email: string;
    name: string;
    hashedPassword: string;
    status: UserStatus;
    emailVerified: boolean;
    lastLoginAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    return new User(
      data.id,
      new Email(data.email),
      new UserName(data.name),
      data.hashedPassword,
      data.status,
      data.emailVerified,
      data.lastLoginAt,
      data.createdAt,
      data.updatedAt,
    );
  }

  // ==================== Getters ====================

  public get email(): string {
    return this._email.value;
  }

  public get name(): string {
    return this._name.value;
  }

  public get status(): UserStatus {
    return this._status;
  }

  public get emailVerified(): boolean {
    return this._emailVerified;
  }

  public get lastLoginAt(): Date | undefined {
    return this._lastLoginAt;
  }

  public get hashedPassword(): string {
    return this._hashedPassword;
  }

  // ==================== Business Methods ====================

  /**
   * Valida una contraseña contra el hash almacenado
   */
  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this._hashedPassword);
  }

  /**
   * Registra un login del usuario
   */
  public recordLogin(ip?: string, userAgent?: string): void {
    this._lastLoginAt = new Date();
    this.touch();

    this.addDomainEvent(
      new UserLoginEvent(this.id, {
        email: this._email.value,
        loginAt: this._lastLoginAt,
        ip,
        userAgent,
      }),
    );
  }

  /**
   * Cambia la contraseña del usuario
   */
  public async changePassword(
    currentPassword: string,
    newPassword: string,
    changedBy: string,
  ): Promise<void> {
    const isCurrentPasswordValid = await this.validatePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error('Password actual incorrecto');
    }

    const newPasswordVO = new Password(newPassword);
    this._hashedPassword = await bcrypt.hash(newPasswordVO.value, 12);
    this.touch();

    this.addDomainEvent(
      new UserPasswordChangedEvent(this.id, {
        changedAt: new Date(),
        changedBy,
      }),
    );
  }

  /**
   * Verifica el email del usuario
   */
  public verifyEmail(): void {
    if (this._emailVerified) {
      throw new Error('Email ya está verificado');
    }

    this._emailVerified = true;
    this.touch();
  }

  /**
   * Desactiva el usuario
   */
  public deactivate(reason?: string, deactivatedBy?: string): void {
    if (this._status === UserStatus.INACTIVE) {
      throw new Error('Usuario ya está desactivado');
    }

    this._status = UserStatus.INACTIVE;
    this.touch();

    this.addDomainEvent(
      new UserDeactivatedEvent(this.id, {
        deactivatedAt: new Date(),
        reason,
        deactivatedBy: deactivatedBy || 'system',
      }),
    );
  }

  /**
   * Activa el usuario
   */
  public activate(): void {
    if (this._status === UserStatus.ACTIVE) {
      throw new Error('Usuario ya está activo');
    }

    this._status = UserStatus.ACTIVE;
    this.touch();
  }

  /**
   * Suspende el usuario
   */
  public suspend(): void {
    this._status = UserStatus.SUSPENDED;
    this.touch();
  }

  // ==================== Domain Events ====================

  private addDomainEvent(event: any): void {
    this.domainEvents.push(event);
  }

  public getUncommittedEvents(): any[] {
    return [...this.domainEvents];
  }

  public clearEvents(): void {
    this.domainEvents = [];
  }

  // ==================== Persistence ====================

  public toPersistence(): {
    id: string;
    email: string;
    name: string;
    hashedPassword: string;
    status: UserStatus;
    emailVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      email: this._email.value,
      name: this._name.value,
      hashedPassword: this._hashedPassword,
      status: this._status,
      emailVerified: this._emailVerified,
      lastLoginAt: this._lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
