/**
 * Protector de middleware para Dev Servers
 * Bloquea acceso no autorizado a servidores de desarrollo
 */

import { DevServerSecurityUtils } from '../utils/dev-server-security-utils';

export class DevServerProtector {
  private static allowedIPs = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

  /**
   * Middleware para Express.js
   */
  static createExpressMiddleware() {
    return (req: any, res: any, next: any) => {
      const clientIP = this.getClientIP(req);

      // Verificar si es desarrollo y IP no autorizada
      if (process.env.NODE_ENV === 'development' && !this.isAllowedIP(clientIP)) {
        DevServerSecurityUtils.logSecurityEvent({
          type: 'unauthorized_dev_access',
          ip: clientIP,
          userAgent: req.get('User-Agent'),
          url: req.url,
          severity: 'HIGH',
          details: {
            method: req.method,
            headers: this.sanitizeHeaders(req.headers)
          }
        });

        res.status(403).json({
          error: 'Access Denied',
          message: 'Development server only accessible from localhost',
          ip: clientIP
        });
        return;
      }

      // Agregar headers de seguridad
      const secureHeaders = DevServerSecurityUtils.generateSecureHeaders();
      Object.entries(secureHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      next();
    };
  }

  /**
   * Middleware para Koa.js
   */
  static createKoaMiddleware() {
    return async (ctx: any, next: any) => {
      const clientIP = this.getClientIP(ctx.req);

      if (process.env.NODE_ENV === 'development' && !this.isAllowedIP(clientIP)) {
        DevServerSecurityUtils.logSecurityEvent({
          type: 'unauthorized_dev_access',
          ip: clientIP,
          userAgent: ctx.get('User-Agent'),
          url: ctx.url,
          severity: 'HIGH',
          details: {
            method: ctx.method,
            headers: this.sanitizeHeaders(ctx.headers)
          }
        });

        ctx.status = 403;
        ctx.body = {
          error: 'Access Denied',
          message: 'Development server only accessible from localhost',
          ip: clientIP
        };
        return;
      }

      // Headers de seguridad
      const secureHeaders = DevServerSecurityUtils.generateSecureHeaders();
      Object.entries(secureHeaders).forEach(([key, value]) => {
        ctx.set(key, value);
      });

      await next();
    };
  }

  /**
   * Función para Vite plugins
   */
  static createVitePlugin() {
    return {
      name: 'dev-server-security',
      configureServer(server: any) {
        server.middlewares.use((req: any, res: any, next: any) => {
          const clientIP = DevServerProtector.getClientIP(req);

          if (!DevServerProtector.isAllowedIP(clientIP)) {
            DevServerSecurityUtils.logSecurityEvent({
              type: 'unauthorized_dev_access',
              ip: clientIP,
              userAgent: req.headers['user-agent'],
              url: req.url,
              severity: 'HIGH',
              details: {
                method: req.method,
                headers: DevServerProtector.sanitizeHeaders(req.headers)
              }
            });

            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              error: 'Access Denied',
              message: 'Development server only accessible from localhost',
              ip: clientIP
            }));
            return;
          }

          // Headers de seguridad
          const secureHeaders = DevServerSecurityUtils.generateSecureHeaders();
          Object.entries(secureHeaders).forEach(([key, value]) => {
            res.setHeader(key, value);
          });

          next();
        });
      }
    };
  }

  /**
   * Verifica si una IP está permitida
   */
  private static isAllowedIP(ip: string): boolean {
    return this.allowedIPs.has(ip);
  }

  /**
   * Obtiene la IP del cliente desde la request
   */
  private static getClientIP(req: any): string {
    // Verificar headers comunes de proxy
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      // Tomar la primera IP (la más cercana al cliente)
      return forwardedFor.split(',')[0].trim();
    }

    const realIP = req.headers['x-real-ip'];
    if (realIP) {
      return realIP;
    }

    // IP directa de la conexión
    return req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown';
  }

  /**
   * Sanitiza headers para logging (remueve información sensible)
   */
  private static sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };

    // Remover headers sensibles
    const sensitiveHeaders = [
      'authorization',
      'cookie',
      'x-api-key',
      'x-auth-token'
    ];

    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Agrega IPs permitidas (útil para desarrollo con contenedores)
   */
  static addAllowedIP(ip: string): void {
    this.allowedIPs.add(ip);
  }

  /**
   * Remueve IPs permitidas
   */
  static removeAllowedIP(ip: string): void {
    this.allowedIPs.delete(ip);
  }

  /**
   * Obtiene lista de IPs permitidas
   */
  static getAllowedIPs(): string[] {
    return Array.from(this.allowedIPs);
  }
}