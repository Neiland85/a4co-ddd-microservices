import { AggregateRoot } from '@a4co/shared-utils';
import { Email, Password, UserName } from '../value-objects/user-value-objects';
import {
  UserRegisteredEvent,
  UserLoginEvent,
  UserPasswordChangedEvent,
  UserDeactivatedEvent,
} from '../events/user-events';
import * as bcrypt from 'bcryptjs';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export class User extends AggregateRoot {
  private constructor(
    id: string,
    private readonly _email: Email,
    private readonly _name: UserName,
    private _hashedPassword: string,
    private _status: UserStatus = UserStatus.ACTIVE,
    private _emailVerified: boolean = false,
    private _lastLoginAt?: Date,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id);
    if (createdAt) {
      (this as any).createdAt = createdAt;
    }
    if (updatedAt) {
      (this as any).updatedAt = updatedAt;
    }
  }

  // Factory method para crear nuevo usuario
  public static async create(
    email: string,
    name: string,
    password: string,
    id?: string
  ): Promise<User> {
    const emailVO = new Email(email);
    const nameVO = new UserName(name);
    const passwordVO = new Password(password);

    const hashedPassword = await bcrypt.hash(passwordVO.value, 12);

    const user = new User(id || require('uuid').v4(), emailVO, nameVO, hashedPassword);

    // Emitir evento de dominio
    user.addDomainEvent(
      new UserRegisteredEvent(user.id, {
        email: emailVO.value,
        name: nameVO.value,
        registeredAt: user.createdAt,
      })
    );

    return user;
  }

  // Factory method para crear usuario con password ya hasheada (para adapters)
  public static async createWithHashedPassword(
    email: string,
    name: string,
    hashedPassword: string,
    id?: string
  ): Promise<User> {
    const emailVO = new Email(email);
    const nameVO = new UserName(name);

    const user = new User(id || require('uuid').v4(), emailVO, nameVO, hashedPassword);

    // Emitir evento de dominio
    user.addDomainEvent(
      new UserRegisteredEvent(user.id, {
        email: emailVO.value,
        name: nameVO.value,
        registeredAt: user.createdAt,
      })
    );

    return user;
  }

  // Factory method para reconstruir desde persistencia
  public static reconstruct(
    identifiers: { id: string; email: string; name: string },
    credentials: {
      hashedPassword: string;
      status: UserStatus;
      emailVerified: boolean;
    },
    timestamps: { lastLoginAt?: Date; createdAt?: Date; updatedAt?: Date },
    data: {
      id: string;
      email: string;
      name: string;
      hashedPassword: string;
      status: UserStatus;
      emailVerified: boolean;
      lastLoginAt?: Date;
      createdAt?: Date;
      updatedAt?: Date;
    }
  ): User {
    return new User(
      data.id,
      new Email(data.email),
      new UserName(data.name),
      data.hashedPassword,
      data.status,
      data.emailVerified,
      data.lastLoginAt,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters
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

  // Métodos de negocio
  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this._hashedPassword);
  }

  public recordLogin(ip?: string, userAgent?: string): void {
    this._lastLoginAt = new Date();
    this.touch();

    this.addDomainEvent(
      new UserLoginEvent(this.id, {
        email: this._email.value,
        loginAt: this._lastLoginAt,
        ip,
        userAgent,
      })
    );
  }

  public async changePassword(
    currentPassword: string,
    newPassword: string,
    changedBy: string
  ): Promise<void> {
    try {
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
        })
      );
    } catch (error) {
      const err = error as Error;
      console.error(`Error en changePassword: ${err.message}`);
      throw err;
    }
  }

  public verifyEmail(): void {
    if (this._emailVerified) {
      throw new Error('Email ya está verificado');
    }

    this._emailVerified = true;
    this.touch();
  }

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
      })
    );
  }

  public activate(): void {
    if (this._status === UserStatus.ACTIVE) {
      throw new Error('Usuario ya está activo');
    }

    this._status = UserStatus.ACTIVE;
    this.touch();
  }

  public suspend(): void {
    this._status = UserStatus.SUSPENDED;
    this.touch();
  }

  // Método para obtener datos para persistencia
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
}
