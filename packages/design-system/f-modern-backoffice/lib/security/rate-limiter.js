"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRateLimiter = exports.apiRateLimiter = exports.RateLimiter = void 0;
class RateLimiter {
    store = new Map();
    config;
    constructor(config) {
        this.config = {
            message: 'Demasiadas solicitudes, intenta más tarde',
            skipSuccessfulRequests: false,
            ...config,
        };
        // Limpiar entradas expiradas cada minuto
        setInterval(() => this.cleanup(), 60000);
    }
    // Verificar si una IP puede hacer una request
    checkLimit(identifier) {
        const now = Date.now();
        const entry = this.store.get(identifier);
        // Si no existe entrada o ha expirado, crear nueva
        if (!entry || now > entry.resetTime) {
            const newEntry = {
                count: 1,
                resetTime: now + this.config.windowMs,
                blocked: false,
            };
            this.store.set(identifier, newEntry);
            return {
                allowed: true,
                remaining: this.config.maxRequests - 1,
                resetTime: newEntry.resetTime,
            };
        }
        // Incrementar contador
        entry.count++;
        // Verificar si excede el límite
        if (entry.count > this.config.maxRequests) {
            entry.blocked = true;
            return {
                allowed: false,
                remaining: 0,
                resetTime: entry.resetTime,
            };
        }
        return {
            allowed: true,
            remaining: this.config.maxRequests - entry.count,
            resetTime: entry.resetTime,
        };
    }
    // Limpiar entradas expiradas
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
            if (now > entry.resetTime) {
                this.store.delete(key);
            }
        }
    }
    // Resetear límite para un identificador específico
    reset(identifier) {
        this.store.delete(identifier);
    }
    // Obtener estadísticas
    getStats() {
        let blockedEntries = 0;
        for (const entry of this.store.values()) {
            if (entry.blocked)
                blockedEntries++;
        }
        return {
            totalEntries: this.store.size,
            blockedEntries,
        };
    }
}
exports.RateLimiter = RateLimiter;
// Instancias predefinidas
exports.apiRateLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 100,
    message: 'Demasiadas solicitudes a la API',
});
exports.loginRateLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 5,
    message: 'Demasiados intentos de login',
});
//# sourceMappingURL=rate-limiter.js.map