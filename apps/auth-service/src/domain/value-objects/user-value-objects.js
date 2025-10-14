"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserName = exports.Password = exports.Email = void 0;
// prompt: ✦ gen-service
const shared_utils_1 = require("@a4co/shared-utils");
class Email extends shared_utils_1.ValueObject {
    constructor(value) {
        Email.validate(value);
        super(value);
    }
    static validate(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            throw new Error('Email es requerido');
        }
        if (!emailRegex.test(email)) {
            throw new Error('Formato de email inválido');
        }
        if (email.length > 254) {
            throw new Error('Email demasiado largo');
        }
    }
}
exports.Email = Email;
class Password extends shared_utils_1.ValueObject {
    constructor(value) {
        Password.validate(value);
        super(value);
    }
    static validate(password) {
        if (!password) {
            throw new Error('Password es requerido');
        }
        if (password.length < 8) {
            throw new Error('Password debe tener al menos 8 caracteres');
        }
        if (password.length > 100) {
            throw new Error('Password demasiado largo');
        }
        // Al menos una letra minúscula, una mayúscula, un número
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        if (!hasLowerCase || !hasUpperCase || !hasNumbers) {
            throw new Error('Password debe contener al menos una minúscula, una mayúscula y un número');
        }
    }
}
exports.Password = Password;
class UserName extends shared_utils_1.ValueObject {
    constructor(value) {
        UserName.validate(value);
        super(value);
    }
    static validate(name) {
        if (!name) {
            throw new Error('Nombre es requerido');
        }
        if (name.length < 2) {
            throw new Error('Nombre debe tener al menos 2 caracteres');
        }
        if (name.length > 50) {
            throw new Error('Nombre demasiado largo');
        }
        // Solo letras, espacios y algunos caracteres especiales
        const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
        if (!nameRegex.test(name)) {
            throw new Error('Nombre contiene caracteres inválidos');
        }
    }
}
exports.UserName = UserName;
//# sourceMappingURL=user-value-objects.js.map