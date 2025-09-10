// Sistema de Rate Limiting
interface RateLimitConfig {
  windowMs: number; // Ventana de tiempo en ms
  maxRequests: number; // Máximo número de requests
  message?: string;
  skipSuccessfulRequests?: boolean;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      message: 'Demasiadas solicitudes, intenta más tarde',
      skipSuccessfulRequests: false,
      ...config,
    };

    // Limpiar entradas expiradas cada minuto
    setInterval(() => this.cleanup(), 60000);
  }

  // Verificar si una IP puede hacer una request
  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    // Si no existe entrada o ha expirado, crear nueva
    if (!entry || now > entry.resetTime) {
      const newEntry: RateLimitEntry = {
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
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  // Resetear límite para un identificador específico
  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  // Obtener estadísticas
  getStats(): { totalEntries: number; blockedEntries: number } {
    let blockedEntries = 0;
    for (const entry of this.store.values()) {
      if (entry.blocked) blockedEntries++;
    }

    return {
      totalEntries: this.store.size,
      blockedEntries,
    };
  }
}

// Instancias predefinidas
export const apiRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 100,
  message: 'Demasiadas solicitudes a la API',
});

export const loginRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 5,
  message: 'Demasiados intentos de login',
});
