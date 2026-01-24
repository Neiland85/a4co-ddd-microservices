import { AggregateRoot } from '@a4co/shared-utils';
import { Email, Password, UserName } from '../value-objects/user-value-objects';
import {
  UserRegisteredEvent,
  UserLoginEvent,
  UserPasswordChangedEvent,
  UserDeactivatedEvent,
} from '../events/user-events';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

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
    private _emailVerified = false,
    private _lastLoginAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  /* =========================
     FACTORY METHODS
     ========================= */

  static async create(
    email: string,
    name: string,
    password: string,
    id: string = uuid(),
  ): Promise<User> {
    const emailVO = new Email(email);
    const nameVO = new UserName(name);
    const passwordVO = new Password(password);

    const hashedPassword = await bcrypt.hash(passwordVO.value, 12);

    const user = new User(id, emailVO, nameVO, hashedPassword);

    user.addDomainEvent(
      new UserRegisteredEvent(user.id, {
        email: emailVO.value,
        name: nameVO.value,
        registeredAt: user.createdAt,
      }),
    );

    return user;
  }

  static createWithHashedPassword(
    email: string,
    name: string,
    hashedPassword: string,
    id: string = uuid(),
  ): User {
    return new User(id, new Email(email), new UserName(name), hashedPassword);
  }

  static reconstruct(data: {
    id: string;
    email: string;
    name: string;
    hashedPassword: string;
    status: UserStatus;
    emailVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
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

  /* =========================
     GETTERS
     ========================= */

  get email(): string {
    return this._email.value;
  }

  get name(): string {
    return this._name.value;
  }

  get status(): UserStatus {
    return this._status;
  }

  get emailVerified(): boolean {
    return this._emailVerified;
  }

  get lastLoginAt(): Date | undefined {
    return this._lastLoginAt;
  }

  get hashedPassword(): string {
    return this._hashedPassword;
  }

  /* =========================
     DOMAIN BEHAVIOR
     ========================= */

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this._hashedPassword);
  }

  recordLogin(ip?: string, userAgent?: string): void {
    this._lastLoginAt = new Date();
    this.touch();

    this.addDomainEvent(
      new UserLoginEvent(this.id, {
        email: this.email,
        loginAt: this._lastLoginAt,
        ip,
        userAgent,
      }),
    );
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    changedBy: string,
  ): Promise<void> {
    if (!(await this.validatePassword(currentPassword))) {
      throw new Error('Password incorrecto');
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

  verifyEmail(): void {
    if (this._emailVerified) {
      throw new Error('Email ya verificado');
    }

    this._emailVerified = true;
    this.touch();
  }

  deactivate(reason?: string, deactivatedBy = 'system'): void {
    if (this._status === UserStatus.INACTIVE) {
      throw new Error('Usuario ya desactivado');
    }

    this._status = UserStatus.INACTIVE;
    this.touch();

    this.addDomainEvent(
      new UserDeactivatedEvent(this.id, {
        deactivatedAt: new Date(),
        reason,
        deactivatedBy,
      }),
    );
  }

  activate(): void {
    if (this._status === UserStatus.ACTIVE) return;

    this._status = UserStatus.ACTIVE;
    this.touch();
  }

  suspend(): void {
    this._status = UserStatus.SUSPENDED;
    this.touch();
  }

  /* =========================
     PERSISTENCE
     ========================= */

  toPersistence() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      hashedPassword: this._hashedPassword,
      status: this._status,
      emailVerified: this._emailVerified,
      lastLoginAt: this._lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
