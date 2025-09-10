"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidator = exports.userAgentSchema = exports.ipAddressSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
// Esquemas de validación comunes
exports.emailSchema = zod_1.z.string().email('Email inválido');
exports.passwordSchema = zod_1.z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(128, 'Máximo 128 caracteres')
    .regex(/^(?=.*[a-z])/, 'Debe contener al menos una minúscula')
    .regex(/^(?=.*[A-Z])/, 'Debe contener al menos una mayúscula')
    .regex(/^(?=.*\d)/, 'Debe contener al menos un número')
    .regex(/^(?=.*[@$!%*?&])/, 'Debe contener al menos un carácter especial');
exports.ipAddressSchema = zod_1.z
    .string()
    .regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Dirección IP inválida');
exports.userAgentSchema = zod_1.z.string().max(500, 'User Agent demasiado largo');
// Validador de entrada de datos
class InputValidator {
    // Sanitizar HTML
    static sanitizeHtml(input) {
        return isomorphic_dompurify_1.default.sanitize(input, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
        });
    }
    // Validar y sanitizar texto
    static validateText(input, maxLength = 1000) {
        const schema = zod_1.z.string().max(maxLength).trim();
        const validated = schema.parse(input);
        return this.sanitizeHtml(validated);
    }
    // Detectar patrones sospechosos
    static detectSuspiciousPatterns(input) {
        const patterns = [
            {
                name: 'SQL Injection',
                regex: /(union|select|insert|update|delete|drop|create|alter|exec|execute)/i,
            },
            { name: 'XSS', regex: /(<script|javascript:|on\w+\s*=)/i },
            { name: 'Path Traversal', regex: /(\.\.\/|\.\.\\)/i },
            { name: 'Command Injection', regex: /(\||&|;|`|\$\(|\${)/i },
        ];
        const detected = [];
        for (const pattern of patterns) {
            if (pattern.regex.test(input)) {
                detected.push(pattern.name);
            }
        }
        return detected;
    }
    // Validar archivo subido
    static validateFile(file, allowedTypes, maxSize) {
        if (!allowedTypes.includes(file.type)) {
            throw new Error(`Tipo de archivo no permitido: ${file.type}`);
        }
        if (file.size > maxSize) {
            throw new Error(`Archivo demasiado grande: ${file.size} bytes`);
        }
        // Verificar extensión del archivo
        const extension = file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = allowedTypes.map(type => type.split('/')[1]);
        if (!extension || !allowedExtensions.includes(extension)) {
            throw new Error(`Extensión de archivo no permitida: ${extension}`);
        }
    }
}
exports.InputValidator = InputValidator;
//# sourceMappingURL=validator.js.map