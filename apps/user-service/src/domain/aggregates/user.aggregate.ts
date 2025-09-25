import { AggregateRoot, DomainEvent, ValueObject } from '../base-classes';

// ========================================
// VALUE OBJECTS
// ========================================

export class Email extends ValueObject<string> {
    constructor(value: string) {
        super(value);
        if (!this.isValidEmail(value)) {
            throw new Error('Invalid email format');
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

export class Username extends ValueObject<string> {
    constructor(value: string) {
        super(value);
        if (value.length < 3 || value.length > 50) {
            throw new Error('Username must be between 3 and 50 characters');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            throw new Error('Username can only contain letters, numbers, and underscores');
        }
    }
}

// ========================================
// DOMAIN EVENTS
// ========================================

export class UserCreatedEvent extends DomainEvent {
    constructor(
        public readonly userId: string,
        public readonly username: string,
        public readonly email: string
    ) {
        super(userId, 'user.created.v1');
    }
}

export class UserUpdatedEvent extends DomainEvent {
    constructor(
        public readonly userId: string,
        public readonly changes: { field: string; oldValue: unknown; newValue: unknown }
    ) {
        super(userId, 'user.updated.v1');
    }
}

// ========================================
// AGGREGATE
// ========================================

export class User extends AggregateRoot {
    private _username: Username;
    private _email: Email;
    private _isActive: boolean;

    constructor(
        id: string,
        username: Username,
        email: Email,
        isActive: boolean = true,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super(id, createdAt, updatedAt);
        this._username = username;
        this._email = email;
        this._isActive = isActive;

        // Add domain event if this is a new user
        if (!createdAt) {
            this.addDomainEvent(new UserCreatedEvent(id, username.value, email.value));
        }
    }

    get username(): Username {
        return this._username;
    }

    get email(): Email {
        return this._email;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    updateUsername(newUsername: Username): void {
        if (!this._username.equals(newUsername)) {
            const oldUsername = this._username;
            this._username = newUsername;
            this.touch();

            this.addDomainEvent(new UserUpdatedEvent(this.id, {
                field: 'username',
                oldValue: oldUsername.value,
                newValue: newUsername.value
            }));
        }
    }

    updateEmail(newEmail: Email): void {
        if (!this._email.equals(newEmail)) {
            const oldEmail = this._email;
            this._email = newEmail;
            this.touch();

            this.addDomainEvent(new UserUpdatedEvent(this.id, {
                field: 'email',
                oldValue: oldEmail.value,
                newValue: newEmail.value
            }));
        }
    }

    deactivate(): void {
        if (this._isActive) {
            this._isActive = false;
            this.touch();

            this.addDomainEvent(new UserUpdatedEvent(this.id, {
                field: 'isActive',
                oldValue: true,
                newValue: false
            }));
        }
    }

    activate(): void {
        if (!this._isActive) {
            this._isActive = true;
            this.touch();

            this.addDomainEvent(new UserUpdatedEvent(this.id, {
                field: 'isActive',
                oldValue: false,
                newValue: true
            }));
        }
    }
}