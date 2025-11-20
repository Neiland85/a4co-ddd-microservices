"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.custom = exports.pattern = exports.max = exports.min = exports.email = exports.maxLength = exports.minLength = exports.required = exports.Validator = void 0;
class Validator {
    constructor() {
        this.rules = [];
    }
    addRule(rule) {
        this.rules.push(rule);
        return this;
    }
    validate(value) {
        const errors = [];
        for (const rule of this.rules) {
            if (!rule.validate(value)) {
                errors.push(rule.message);
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}
exports.Validator = Validator;
const required = (message = 'Este campo es requerido') => ({
    validate: (value) => value !== null && value !== undefined && value !== '',
    message,
});
exports.required = required;
const minLength = (min, message) => ({
    validate: (value) => value.length >= min,
    message: message || `Debe tener al menos ${min} caracteres`,
});
exports.minLength = minLength;
const maxLength = (max, message) => ({
    validate: (value) => value.length <= max,
    message: message || `Debe tener máximo ${max} caracteres`,
});
exports.maxLength = maxLength;
const email = (message = 'Formato de email inválido') => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
});
exports.email = email;
const min = (min, message) => ({
    validate: (value) => value >= min,
    message: message || `Debe ser mayor o igual a ${min}`,
});
exports.min = min;
const max = (max, message) => ({
    validate: (value) => value <= max,
    message: message || `Debe ser menor o igual a ${max}`,
});
exports.max = max;
const pattern = (regex, message) => ({
    validate: (value) => regex.test(value),
    message,
});
exports.pattern = pattern;
const custom = (validator, message) => ({
    validate: validator,
    message,
});
exports.custom = custom;
//# sourceMappingURL=validation-utils.js.map