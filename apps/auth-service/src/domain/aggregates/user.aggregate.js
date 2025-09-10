"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserStatus = void 0;
const shared_utils_1 = require("@a4co/shared-utils");
const user_value_objects_1 = require("../value-objects/user-value-objects");
const user_events_1 = require("../events/user-events");
const bcrypt = __importStar(require("bcryptjs"));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
class User extends shared_utils_1.AggregateRoot {
    _email;
    _name;
    _hashedPassword;
    _status;
    _emailVerified;
    _lastLoginAt;
    constructor(id, _email, _name, _hashedPassword, _status = UserStatus.ACTIVE, _emailVerified = false, _lastLoginAt, createdAt, updatedAt) {
        super(id);
        this._email = _email;
        this._name = _name;
        this._hashedPassword = _hashedPassword;
        this._status = _status;
        this._emailVerified = _emailVerified;
        this._lastLoginAt = _lastLoginAt;
        if (createdAt) {
            this.createdAt = createdAt;
        }
        if (updatedAt) {
            this.updatedAt = updatedAt;
        }
    }
    // Factory method para crear nuevo usuario
    static async create(email, name, password, id) {
        const emailVO = new user_value_objects_1.Email(email);
        const nameVO = new user_value_objects_1.UserName(name);
        const passwordVO = new user_value_objects_1.Password(password);
        const hashedPassword = await bcrypt.hash(passwordVO.value, 12);
        const user = new User(id || require('uuid').v4(), emailVO, nameVO, hashedPassword);
        // Emitir evento de dominio
        user.addDomainEvent(new user_events_1.UserRegisteredEvent(user.id, {
            email: emailVO.value,
            name: nameVO.value,
            registeredAt: user.createdAt,
        }));
        return user;
    }
    // Factory method para crear usuario con password ya hasheada (para adapters)
    static async createWithHashedPassword(email, name, hashedPassword, id) {
        const emailVO = new user_value_objects_1.Email(email);
        const nameVO = new user_value_objects_1.UserName(name);
        const user = new User(id || require('uuid').v4(), emailVO, nameVO, hashedPassword);
        // Emitir evento de dominio
        user.addDomainEvent(new user_events_1.UserRegisteredEvent(user.id, {
            email: emailVO.value,
            name: nameVO.value,
            registeredAt: user.createdAt,
        }));
        return user;
    }
    // Factory method para reconstruir desde persistencia
    static reconstruct(identifiers, credentials, timestamps, data) {
        return new User(data.id, new user_value_objects_1.Email(data.email), new user_value_objects_1.UserName(data.name), data.hashedPassword, data.status, data.emailVerified, data.lastLoginAt, data.createdAt, data.updatedAt);
    }
    // Getters
    get email() {
        return this._email.value;
    }
    get name() {
        return this._name.value;
    }
    get status() {
        return this._status;
    }
    get emailVerified() {
        return this._emailVerified;
    }
    get lastLoginAt() {
        return this._lastLoginAt;
    }
    get hashedPassword() {
        return this._hashedPassword;
    }
    // Métodos de negocio
    async validatePassword(password) {
        return await bcrypt.compare(password, this._hashedPassword);
    }
    recordLogin(ip, userAgent) {
        this._lastLoginAt = new Date();
        this.touch();
        this.addDomainEvent(new user_events_1.UserLoginEvent(this.id, {
            email: this._email.value,
            loginAt: this._lastLoginAt,
            ip,
            userAgent,
        }));
    }
    async changePassword(currentPassword, newPassword, changedBy) {
        try {
            const isCurrentPasswordValid = await this.validatePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                throw new Error('Password actual incorrecto');
            }
            const newPasswordVO = new user_value_objects_1.Password(newPassword);
            this._hashedPassword = await bcrypt.hash(newPasswordVO.value, 12);
            this.touch();
            this.addDomainEvent(new user_events_1.UserPasswordChangedEvent(this.id, {
                changedAt: new Date(),
                changedBy,
            }));
        }
        catch (error) {
            const err = error;
            console.error(`Error en changePassword: ${err.message}`);
            throw err;
        }
    }
    verifyEmail() {
        if (this._emailVerified) {
            throw new Error('Email ya está verificado');
        }
        this._emailVerified = true;
        this.touch();
    }
    deactivate(reason, deactivatedBy) {
        if (this._status === UserStatus.INACTIVE) {
            throw new Error('Usuario ya está desactivado');
        }
        this._status = UserStatus.INACTIVE;
        this.touch();
        this.addDomainEvent(new user_events_1.UserDeactivatedEvent(this.id, {
            deactivatedAt: new Date(),
            reason,
            deactivatedBy: deactivatedBy || 'system',
        }));
    }
    activate() {
        if (this._status === UserStatus.ACTIVE) {
            throw new Error('Usuario ya está activo');
        }
        this._status = UserStatus.ACTIVE;
        this.touch();
    }
    suspend() {
        this._status = UserStatus.SUSPENDED;
        this.touch();
    }
    // Método para obtener datos para persistencia
    toPersistence() {
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
exports.User = User;
//# sourceMappingURL=user.aggregate.js.map