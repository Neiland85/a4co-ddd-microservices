/**
 * Utilidades de seguridad para prevenir SSRF
 * Funciones helper para validación y sanitización
 */

import { URLValidator } from '../validators/url.validator';
import { IPRangeBlocker } from './ip-range-blocker';

export class SSRFSecurityUtils {
  /**
   * Valida y sanitiza una URL para uso seguro
   */
  static validateAndSanitizeURL(url: string): {
    isValid: boolean;
    sanitizedURL?: string;
    violations: string[]
  } {
    const validation = URLValidator.validateURL(url);

    if (!validation.isValid) {
      return {
        isValid: false,
        violations: validation.violations
      };
    }

    const sanitized = URLValidator.sanitizeURL(url);
    return {
      isValid: true,
      sanitizedURL: sanitized,
      violations: []
    };
  }

  /**
   * Verifica si una URL es segura para fetch
   */
  static isSafeForFetch(url: string): { isSafe: boolean; reason?: string } {
    // Validar formato URL
    const validation = URLValidator.validateURL(url);
    if (!validation.isValid) {
      return { isSafe: false, reason: validation.violations.join(', ') };
    }

    // Verificar IP ranges
    const ipCheck = IPRangeBlocker.containsBlockedIP(url);
    if (ipCheck.isBlocked) {
      return { isSafe: false, reason: ipCheck.reason };
    }

    return { isSafe: true };
  }

  /**
   * Wrapper seguro para fetch que previene SSRF
   */
  static async safeFetch(url: string, options?: RequestInit): Promise<Response> {
    const safetyCheck = this.isSafeForFetch(url);

    if (!safetyCheck.isSafe) {
      throw new Error(`Unsafe URL blocked: ${safetyCheck.reason}`);
    }

    // Sanitizar URL antes de usar
    const sanitized = URLValidator.sanitizeURL(url);

    return fetch(sanitized, options);
  }

  /**
   * Genera headers seguros para requests
   */
  static generateSecureHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
    };
  }

  /**
   * Valida parámetros de query string
   */
  static validateQueryParams(params: Record<string, string>): {
    isValid: boolean;
    violations: string[]
  } {
    const violations: string[] = [];

    for (const [key, value] of Object.entries(params)) {
      // Verificar si el valor parece una URL
      if (this.looksLikeURL(value)) {
        const validation = URLValidator.validateURL(value);
        if (!validation.isValid) {
          violations.push(`Parameter '${key}': ${validation.violations.join(', ')}`);
        }
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Verifica si una cadena parece una URL
   */
  private static looksLikeURL(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch {
      return str.startsWith('http://') || str.startsWith('https://') ||
             str.includes('://') || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(str);
    }
  }

  /**
   * Logs de seguridad para monitoreo
   */
  static logSecurityEvent(event: {
    type: 'ssrf_attempt' | 'redirect_blocked' | 'unsafe_url';
    url?: string;
    violations?: string[];
    ip?: string;
    userAgent?: string;
    timestamp?: Date;
  }): void {
    const logEntry = {
      timestamp: event.timestamp || new Date(),
      type: event.type,
      url: event.url,
      violations: event.violations,
      ip: event.ip,
      userAgent: event.userAgent,
      severity: 'HIGH'
    };

    console.warn('SECURITY EVENT:', JSON.stringify(logEntry, null, 2));

    // Aquí se podría integrar con servicios de logging como Winston, Pino, etc.
    // o enviar alertas a sistemas de monitoreo
  }
}

export default SSRFSecurityUtils;