/**
 * Dev Server Protector Middleware
 * Provides middleware protection for various dev server frameworks
 */

import { DevServerValidator } from '../validators/dev-server.validator';

export interface ExpressRequest {
  ip?: string;
  hostname?: string;
  headers: Record<string, string | string[]>;
  method: string;
  url: string;
}

export interface ExpressResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ExpressResponse;
  send(body: any): void;
}

export interface KoaContext {
  ip?: string;
  hostname?: string;
  headers: Record<string, string | string[]>;
  method: string;
  url: string;
  set(key: string, value: string): void;
  status: number;
  body: any;
}

export interface VitePlugin {
  name: string;
  configureServer?: (server: any) => void;
}

export class DevServerProtector {
  private validator: DevServerValidator;

  constructor() {
    this.validator = new DevServerValidator();
  }

  /**
   * Creates Express.js middleware for dev server protection
   */
  createExpressMiddleware() {
    return (req: ExpressRequest, res: ExpressResponse, next: () => void) => {
      // Validate request origin
      const clientIp = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';
      const hostname = req.hostname || (req.headers['host'] as string) || '';

      // Log suspicious requests
      if (this.isSuspiciousRequest(clientIp, hostname)) {
        console.warn(
          `[DEV SERVER SECURITY] Suspicious request blocked: ${req.method} ${req.url} from ${clientIp}`
        );
        res.status(403).send('Access denied');
        return;
      }

      // Add security headers
      this.addSecurityHeaders(res.setHeader.bind(res));

      next();
    };
  }

  /**
   * Creates Koa.js middleware for dev server protection
   */
  createKoaMiddleware() {
    return async (ctx: KoaContext, next: () => Promise<void>) => {
      // Validate request origin
      const clientIp = ctx.ip || (ctx.headers['x-forwarded-for'] as string) || 'unknown';
      const hostname = ctx.hostname || (ctx.headers['host'] as string) || '';

      // Log suspicious requests
      if (this.isSuspiciousRequest(clientIp, hostname)) {
        console.warn(
          `[DEV SERVER SECURITY] Suspicious request blocked: ${ctx.method} ${ctx.url} from ${clientIp}`
        );
        ctx.status = 403;
        ctx.body = 'Access denied';
        return;
      }

      // Add security headers
      this.addSecurityHeaders(ctx.set.bind(ctx));

      await next();
    };
  }

  /**
   * Creates Vite plugin for dev server protection
   */
  createVitePlugin(): VitePlugin {
    return {
      name: 'vite-plugin-dev-server-security',
      configureServer(server: any) {
        server.middlewares.use((req: any, res: any, next: () => void) => {
          const protector = new DevServerProtector();

          // Validate request
          const clientIp = req.socket?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
          const hostname = req.headers.host || '';

          if (protector.isSuspiciousRequest(clientIp, hostname)) {
            console.warn(
              `[VITE DEV SERVER SECURITY] Suspicious request blocked: ${req.method} ${req.url} from ${clientIp}`
            );
            res.statusCode = 403;
            res.end('Access denied');
            return;
          }

          // Add security headers
          protector.addSecurityHeaders((key: string, value: string) => {
            res.setHeader(key, value);
          });

          next();
        });
      },
    };
  }

  /**
   * Checks if a request appears suspicious
   */
  private isSuspiciousRequest(clientIp: string, hostname: string): boolean {
    // Block requests from external IPs
    if (this.isExternalIp(clientIp)) {
      return true;
    }

    // Block requests with suspicious hostnames
    if (hostname && !this.validator.validateHostConfig(hostname.split(':')[0])) {
      return true;
    }

    return false;
  }

  /**
   * Checks if an IP address is external (not localhost)
   */
  private isExternalIp(ip: string): boolean {
    if (!ip || ip === 'unknown') return false;

    // Allow localhost variations
    const localhostIps = ['127.0.0.1', '::1', 'localhost', '::ffff:127.0.0.1'];
    if (localhostIps.includes(ip)) {
      return false;
    }

    // Check for local network ranges
    const localRanges = [/^192\.168\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./];

    return !localRanges.some(range => range.test(ip));
  }

  /**
   * Adds security headers to response
   */
  private addSecurityHeaders(setHeader: (key: string, value: string) => void): void {
    const headers = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };

    Object.entries(headers).forEach(([key, value]) => {
      setHeader(key, value);
    });
  }
}
