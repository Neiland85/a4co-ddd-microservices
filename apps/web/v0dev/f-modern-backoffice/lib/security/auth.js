"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// Esquemas de validación
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    twoFactorCode: zod_1.z.string().optional(),
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z
        .string()
        .min(8, 'Mínimo 8 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Debe contener mayúscula, minúscula, número y carácter especial'),
    name: zod_1.z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
    role: zod_1.z.enum(['admin', 'moderator', 'user']).default('user'),
});
class AuthService {
    JWT_SECRET = 'backoffice-demo-secret-key-2024';
    JWT_EXPIRES_IN = 24 * 60 * 60 * 1000; // 24 horas en ms
    MAX_LOGIN_ATTEMPTS = 5;
    LOCK_TIME = 30 * 60 * 1000; // 30 minutos
    // Generar hash de contraseña simple (en producción usar bcrypt)
    async hashPassword(password) {
        // Simulación simple de hash
        const encoder = new TextEncoder();
        const data = encoder.encode(password + this.JWT_SECRET);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Verificar contraseña
    async verifyPassword(password, hash) {
        const computedHash = await this.hashPassword(password);
        return computedHash === hash;
    }
    // Generar JWT simple (sin librerías externas)
    generateToken(payload) {
        const now = Date.now();
        const exp = now + this.JWT_EXPIRES_IN;
        const fullPayload = {
            ...payload,
            exp,
        };
        // Crear token simple codificado en base64
        const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
        const body = btoa(JSON.stringify(fullPayload));
        const signature = btoa(`${header}.${body}.${this.JWT_SECRET}`);
        return `${header}.${body}.${signature}`;
    }
    // Verificar JWT simple
    verifyToken(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3)
                return null;
            const [header, body, signature] = parts;
            // Verificar firma
            const expectedSignature = btoa(`${header}.${body}.${this.JWT_SECRET}`);
            if (signature !== expectedSignature)
                return null;
            // Decodificar payload
            const payload = JSON.parse(atob(body));
            // Verificar expiración
            if (Date.now() > payload.exp)
                return null;
            return payload;
        }
        catch (error) {
            return null;
        }
    }
    // Verificar si la cuenta está bloqueada
    isAccountLocked(user) {
        return !!(user.lockedUntil && user.lockedUntil > new Date());
    }
    // Incrementar intentos fallidos
    async incrementFailedAttempts(userId) {
        console.log(`Incrementando intentos fallidos para usuario ${userId}`);
    }
    // Resetear intentos fallidos
    async resetFailedAttempts(userId) {
        console.log(`Reseteando intentos fallidos para usuario ${userId}`);
    }
    // Generar secreto para 2FA
    generate2FASecret() {
        return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    }
    // Verificar código 2FA (simulado)
    verify2FACode(secret, code) {
        const expectedCode = (Number.parseInt(secret.slice(-6), 36) % 1000000)
            .toString()
            .padStart(6, '0');
        return code === expectedCode;
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=auth.js.map