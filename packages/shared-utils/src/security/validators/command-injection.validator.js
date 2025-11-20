"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandInjectionValidator = void 0;
class CommandInjectionValidator {
    static validateString(input) {
        const violations = [];
        const dangerousPatterns = [/eval\s*\(/, /Function\s*\(/, /setTimeout\s*\(/];
        if (typeof input === 'string') {
            dangerousPatterns.forEach((pattern, index) => {
                if (pattern.test(input)) {
                    violations.push('Dangerous pattern ' + (index + 1) + ' found');
                }
            });
        }
        return { isValid: violations.length === 0, violations };
    }
    static sanitizeString(input) {
        if (typeof input !== 'string')
            return input;
        return input.replace(/<script[^>]*>.*?<\/script>/gi, '');
    }
}
exports.CommandInjectionValidator = CommandInjectionValidator;
exports.default = CommandInjectionValidator;
//# sourceMappingURL=command-injection.validator.js.map