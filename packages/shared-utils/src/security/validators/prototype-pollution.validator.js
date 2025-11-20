"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrototypePollutionValidator = void 0;
class PrototypePollutionValidator {
    static validateObject(obj) {
        const violations = [];
        if (obj && typeof obj === 'object') {
            const objProto = Object.getPrototypeOf(obj);
            if (objProto !== Object.prototype && objProto !== null) {
                violations.push('Object has modified prototype (potential prototype pollution)');
            }
            const dangerousKeys = ['constructor', 'prototype'];
            const allKeys = Object.getOwnPropertyNames(obj);
            allKeys.forEach(key => {
                if (dangerousKeys.includes(key)) {
                    violations.push('Dangerous key found: ' + key);
                }
            });
            if (obj.__proto__ !== Object.prototype && obj.__proto__ !== null) {
                violations.push('Object has modified __proto__ (prototype pollution detected)');
            }
        }
        return { isValid: violations.length === 0, violations };
    }
    static sanitizeObject(obj) {
        if (!obj || typeof obj !== 'object')
            return obj;
        const sanitized = {};
        const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
        for (const [key, value] of Object.entries(obj)) {
            if (!dangerousKeys.includes(key)) {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
}
exports.PrototypePollutionValidator = PrototypePollutionValidator;
exports.default = PrototypePollutionValidator;
//# sourceMappingURL=prototype-pollution.validator.js.map