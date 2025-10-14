import { z } from 'zod';

// Esquemas de validación
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  twoFactorCode: z.string().optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Debe contener mayúscula, minúscula, número y carácter especial'
    ),
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  role: z.enum(['admin', 'moderator', 'user']).default('user'),
});

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
  exp: number;
}

class AuthService {
  private readonly JWT_SECRET = 'backoffice-demo-secret-key-2024';
  private readonly JWT_EXPIRES_IN = 24 * 60 * 60 * 1000; // 24 horas en ms
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_TIME = 30 * 60 * 1000; // 30 minutos

  // Generar hash de contraseña simple (en producción usar bcrypt)
  async hashPassword(password: string): Promise<string> {
    // Simulación simple de hash
    const encoder = new TextEncoder();
    const data = encoder.encode(password + this.JWT_SECRET);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Verificar contraseña
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const computedHash = await this.hashPassword(password);
    return computedHash === hash;
  }

  // Generar JWT simple (sin librerías externas)
  generateToken(payload: Omit<JWTPayload, 'exp'>): string {
    const now = Date.now();
    const exp = now + this.JWT_EXPIRES_IN;

    const fullPayload: JWTPayload = {
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
  verifyToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [header, body, signature] = parts;

      // Verificar firma
      const expectedSignature = btoa(`${header}.${body}.${this.JWT_SECRET}`);
      if (signature !== expectedSignature) return null;

      // Decodificar payload
      const payload: JWTPayload = JSON.parse(atob(body));

      // Verificar expiración
      if (Date.now() > payload.exp) return null;

      return payload;
    } catch (error) {
      return null;
    }
  }

  // Verificar si la cuenta está bloqueada
  isAccountLocked(user: User): boolean {
    return !!(user.lockedUntil && user.lockedUntil > new Date());
  }

  // Incrementar intentos fallidos
  async incrementFailedAttempts(userId: string): Promise<void> {
    console.log(`Incrementando intentos fallidos para usuario ${userId}`);
  }

  // Resetear intentos fallidos
  async resetFailedAttempts(userId: string): Promise<void> {
    console.log(`Reseteando intentos fallidos para usuario ${userId}`);
  }

  // Generar secreto para 2FA
  generate2FASecret(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }

  // Verificar código 2FA (simulado)
  verify2FACode(secret: string, code: string): boolean {
    const expectedCode = (Number.parseInt(secret.slice(-6), 36) % 1000000)
      .toString()
      .padStart(6, '0');
    return code === expectedCode;
  }
}

export const authService = new AuthService();
