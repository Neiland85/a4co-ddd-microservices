#!/usr/bin/env node

/**
 * Script de Mitigación de Vulnerabilidades en Dev Servers
 * Ataque: esbuild — Dev server accepts arbitrary requests and leaks responses (Moderate)
 *
 * Tácticas: Initial Access → Exfiltration (development environment)
 * Vector: Dev server corriendo en host accesible; sitio malicioso puede hacer fetch a localhost:PORT
 * Impacto: Leak de código fuente, tokens, variables de entorno
 */

const fs = require('fs');
const path = require('path');

console.log('🛡️ Iniciando mitigación de vulnerabilidades en Dev Servers');
console.log('=========================================================\n');

// Configuración de archivos a crear
const filesToCreate = [
  {
    path: 'packages/shared-utils/src/security/validators/dev-server.validator.ts',
    content: `/**
 * Validador de configuraciones de Dev Servers
 * Detecta configuraciones inseguras que permiten acceso externo
 */

export class DevServerValidator {
  /**
   * Valida configuración de host de dev server
   */
  static validateHostConfig(host: string | undefined): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (!host) {
      // Host no especificado - podría ser inseguro dependiendo del framework
      violations.push('Host no especificado - verificar configuración por defecto');
    } else if (host === '0.0.0.0') {
      violations.push('Host 0.0.0.0 permite conexiones desde cualquier interfaz de red');
    } else if (host !== '127.0.0.1' && host !== 'localhost') {
      violations.push(\`Host '\${host}' podría ser accesible externamente\`);
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Valida configuración de puerto de dev server
   */
  static validatePortConfig(port: number | string | undefined): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (!port) {
      violations.push('Puerto no especificado - usar puerto por defecto podría ser inseguro');
      return { isValid: false, violations };
    }

    const portNum = typeof port === 'string' ? parseInt(port, 10) : port;

    // Puertos comunes de dev servers que podrían ser peligrosos si son accesibles
    const dangerousPorts = [3000, 3001, 4000, 5000, 8000, 8080, 9000, 9090];

    if (dangerousPorts.includes(portNum)) {
      violations.push(\`Puerto \${portNum} es un puerto común de desarrollo - alto riesgo si es accesible externamente\`);
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Valida configuración CORS para dev servers
   */
  static validateCorsConfig(cors: any): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (!cors) {
      violations.push('CORS no configurado - podría permitir requests desde orígenes maliciosos');
      return { isValid: false, violations };
    }

    // Verificar configuración permisiva
    if (cors.origin === '*' || cors.origin === true) {
      violations.push('CORS origin configurado como wildcard (*) - permite requests desde cualquier origen');
    }

    if (cors.credentials === true) {
      violations.push('CORS credentials habilitado - permite envío de cookies/autenticación');
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Valida configuración completa de dev server
   */
  static validateDevServerConfig(config: {
    host?: string;
    port?: number | string;
    cors?: any;
    https?: boolean;
    open?: boolean | string;
  }): { isValid: boolean; violations: string[] } {
    const allViolations: string[] = [];

    // Validar host
    const hostValidation = this.validateHostConfig(config.host);
    allViolations.push(...hostValidation.violations);

    // Validar puerto
    const portValidation = this.validatePortConfig(config.port);
    allViolations.push(...portValidation.violations);

    // Validar CORS
    if (config.cors) {
      const corsValidation = this.validateCorsConfig(config.cors);
      allViolations.push(...corsValidation.violations);
    }

    // Validar HTTPS
    if (!config.https) {
      allViolations.push('HTTPS no habilitado - tráfico no encriptado en desarrollo');
    }

    // Validar auto-open
    if (config.open) {
      allViolations.push('Auto-open habilitado - podría abrir URLs maliciosas automáticamente');
    }

    return {
      isValid: allViolations.length === 0,
      violations: allViolations
    };
  }
}`,
  },
  {
    path: 'packages/shared-utils/src/security/utils/dev-server-security-utils.ts',
    content: `/**
 * Utilidades de seguridad para Dev Servers
 * Funciones helper para proteger servidores de desarrollo
 */

import { DevServerValidator } from '../validators/dev-server.validator';

export class DevServerSecurityUtils {
  /**
   * Genera configuración segura para Vite
   */
  static generateSecureViteConfig(): string {
    return \`import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '127.0.0.1', // Solo localhost
    port: 3000,
    strictPort: true,
    cors: {
      origin: false, // Deshabilitar CORS en desarrollo
      credentials: false
    },
    https: false, // Usar HTTP en desarrollo local
    open: false, // No abrir automáticamente
    hmr: {
      port: 3001, // Puerto separado para HMR
    }
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true
  }
});\`;
  }

  /**
   * Genera configuración segura para Next.js
   */
  static generateSecureNextConfig(): string {
    return \`/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    // Forzar host local
    env: {
      HOST: '127.0.0.1'
    }
  }),

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Configuración del dev server
  ...(process.env.NODE_ENV === 'development' && {
    devIndicators: {
      buildActivity: false, // Ocultar indicadores de build
    }
  })
};

export default nextConfig;\`;
  }

  /**
   * Genera configuración segura para esbuild
   */
  static generateSecureEsbuildConfig(): string {
    return \`import * as esbuild from 'esbuild';

const isDev = process.env.NODE_ENV === 'development';

const config = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  sourcemap: isDev,
  minify: !isDev,
  target: 'es2020',

  // Configuración segura del servidor
  ...(isDev && {
    serve: {
      host: '127.0.0.1', // Solo localhost
      port: 3000,
      servedir: 'dist',
      onRequest: (args) => {
        // Log de requests para detección de acceso no autorizado
        if (args.remoteAddress !== '127.0.0.1' && args.remoteAddress !== '::1') {
          console.warn(\`⚠️  Request desde IP externa: \${args.remoteAddress} - \${args.method} \${args.path}\`);
        }
      }
    }
  })
};

await esbuild.build(config);\`;
  }

  /**
   * Genera middleware de protección para dev servers
   */
  static generateDevServerMiddleware(): string {
    return \`import { createServer } from 'http';
import { parse } from 'url';

// Middleware de protección para dev servers
function createSecureDevMiddleware(port: number = 3000) {
  return (req, res, next) => {
    const { remoteAddress } = req.socket;

    // Bloquear requests desde IPs externas en desarrollo
    if (process.env.NODE_ENV === 'development') {
      if (remoteAddress !== '127.0.0.1' && remoteAddress !== '::1' && remoteAddress !== '::ffff:127.0.0.1') {
        console.warn(\`🚫 Request bloqueado desde IP externa: \${remoteAddress}\`);

        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Access denied',
          message: 'Development server only accessible from localhost'
        }));
        return;
      }
    }

    // Headers de seguridad
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
  };
}

export { createSecureDevMiddleware };\`;
  }

  /**
   * Genera script de verificación de seguridad
   */
  static generateSecurityCheckScript(): string {
    return \`#!/usr/bin/env node

/**
 * Verificación de seguridad para Dev Servers
 * Ejecutar: node scripts/check-dev-security.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de seguridad de Dev Servers...');

const issues = [];

// Verificar procesos corriendo en puertos de desarrollo
try {
  const netstat = execSync('netstat -tulpn 2>/dev/null || ss -tulpn 2>/dev/null || echo "netstat/ss not available"', { encoding: 'utf-8' });

  const devPorts = [3000, 3001, 4000, 5000, 8000, 8080, 9000, 9090];
  const lines = netstat.split('\\n');

  for (const line of lines) {
    for (const port of devPorts) {
      if (line.includes(\`:\${port} \`)) {
        // Verificar si está bound a 0.0.0.0
        if (line.includes('0.0.0.0:\${port}')) {
          issues.push(\`🚨 Puerto \${port} accesible desde cualquier interfaz (0.0.0.0)\`);
        }
      }
    }
  }
} catch (error) {
  console.log('⚠️  No se pudo verificar puertos de red');
}

// Verificar archivos de configuración
const configFiles = [
  'vite.config.js',
  'vite.config.ts',
  'next.config.js',
  'next.config.mjs',
  'webpack.config.js',
  'esbuild.config.js'
];

for (const configFile of configFiles) {
  const configPath = path.join(process.cwd(), configFile);
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf8');

      // Verificar host inseguro
      if (content.includes("host: '0.0.0.0'") || content.includes('host: "0.0.0.0"')) {
        issues.push(\`🚨 \${configFile} tiene host 0.0.0.0 (accesible externamente)\`);
      }

      // Verificar CORS inseguro
      if (content.includes("origin: '*'") || content.includes('origin: "*"')) {
        issues.push(\`🚨 \${configFile} tiene CORS origin wildcard\`);
      }
    } catch (error) {
      // Ignorar errores de lectura
    }
  }
}

// Verificar variables de entorno sensibles
const envFiles = ['.env', '.env.local', '.env.development'];
for (const envFile of envFiles) {
  const envPath = path.join(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const sensitivePatterns = [
        /API_KEY=/,
        /SECRET=/,
        /TOKEN=/,
        /PASSWORD=/,
        /DATABASE_URL=/
      ];

      for (const pattern of sensitivePatterns) {
        if (pattern.test(content)) {
          issues.push(\`🚨 \${envFile} contiene posibles secrets sensibles\`);
          break;
        }
      }
    } catch (error) {
      // Ignorar errores de lectura
    }
  }
}

if (issues.length === 0) {
  console.log('✅ No se encontraron problemas de seguridad evidentes');
} else {
  console.log('\\n🚨 Problemas de seguridad encontrados:');
  issues.forEach(issue => console.log(\`  \${issue}\`));
  console.log('\\n💡 Recomendaciones:');
  console.log('  - Configurar host: "127.0.0.1" en dev servers');
  console.log('  - Usar CORS restrictivo en desarrollo');
  console.log('  - No exponer secrets en archivos .env de desarrollo');
  console.log('  - Usar túnel SSH para acceso remoto seguro');
}

process.exit(issues.length > 0 ? 1 : 0);\`;
  }

  /**
   * Genera headers de seguridad para dev servers
   */
  static generateSecureHeaders(): Record<string, string> {
    return {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }

  /**
   * Registra evento de seguridad
   */
  static logSecurityEvent(event: {
    type: string;
    ip: string;
    userAgent?: string;
    url?: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    details?: any;
  }): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type: 'dev_server_security',
      event: event.type,
      ip: event.ip,
      userAgent: event.userAgent,
      url: event.url,
      severity: event.severity,
      details: event.details
    };

    console.warn(\`🛡️ DEV SERVER SECURITY: \${JSON.stringify(logEntry)}\`);

    // En producción, enviar a sistema de logging centralizado
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrar con sistema de logging (Winston, Pino, etc.)
    }
  }
}`,
  },
  {
    path: 'packages/shared-utils/src/security/middleware/dev-server-protector.ts',
    content: `/**
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
}`,
  },
  {
    path: 'eslint-rules/dev-server-rules.js',
    content: `/**
 * ESLint rules para detectar configuraciones inseguras de Dev Servers
 */

module.exports = {
  rules: {
    'no-insecure-dev-host': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detecta configuraciones de host inseguras en dev servers',
          category: 'Security',
          recommended: true
        },
        messages: {
          insecureHost: 'Host "{{host}}" permite acceso externo. Use "127.0.0.1" para desarrollo local.',
          missingHost: 'Host no especificado. Agregue host: "127.0.0.1" para desarrollo seguro.'
        },
        schema: []
      },
      create(context) {
        return {
          Property(node) {
            // Verificar configuraciones de Vite
            if (node.key.name === 'host' || node.key.value === 'host') {
              const parent = node.parent;
              if (parent && parent.type === 'ObjectExpression') {
                // Buscar propiedad server
                const serverProp = parent.properties.find((p: any) =>
                  (p.key.name === 'server' || p.key.value === 'server')
                );

                if (serverProp && serverProp.value === parent) {
                  if (node.value.type === 'Literal') {
                    if (node.value.value === '0.0.0.0') {
                      context.report({
                        node,
                        messageId: 'insecureHost',
                        data: { host: node.value.value }
                      });
                    }
                  }
                }
              }
            }

            // Verificar configuraciones de Next.js
            if (node.key.name === 'HOST' || node.key.value === 'HOST') {
              if (node.value.type === 'Literal') {
                if (node.value.value === '0.0.0.0') {
                  context.report({
                    node,
                    messageId: 'insecureHost',
                    data: { host: node.value.value }
                  });
                }
              }
            }
          }
        };
      }
    },

    'no-dev-cors-wildcard': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detecta configuraciones CORS inseguras en desarrollo',
          category: 'Security',
          recommended: true
        },
        messages: {
          wildcardOrigin: 'CORS origin "*" permite requests desde cualquier dominio. Use origen específico o deshabilite CORS en desarrollo.',
          permissiveCors: 'Configuración CORS permisiva detectada. Restrinja origins en desarrollo.'
        },
        schema: []
      },
      create(context) {
        return {
          Property(node) {
            if (node.key.name === 'cors' || node.key.value === 'cors') {
              if (node.value.type === 'ObjectExpression') {
                const originProp = node.value.properties.find((p: any) =>
                  p.key.name === 'origin' || p.key.value === 'origin'
                );

                if (originProp && originProp.value.type === 'Literal') {
                  if (originProp.value.value === '*') {
                    context.report({
                      node: originProp,
                      messageId: 'wildcardOrigin'
                    });
                  }
                }
              }
            }
          }
        };
      }
    },

    'no-dev-secrets-exposure': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detecta exposición potencial de secrets en código de desarrollo',
          category: 'Security',
          recommended: true
        },
        messages: {
          exposedSecret: 'Posible exposición de secret "{{secret}}" en código. Use variables de entorno.',
          hardcodedApiKey: 'API key hardcodeada detectada. Use variables de entorno.'
        },
        schema: []
      },
      create(context) {
        const secretPatterns = [
          /api[_-]?key/i,
          /secret[_-]?key/i,
          /access[_-]?token/i,
          /auth[_-]?token/i,
          /password/i,
          /database[_-]?url/i
        ];

        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              const value = node.value.toLowerCase();

              for (const pattern of secretPatterns) {
                if (pattern.test(value) && value.length > 10) {
                  // Verificar si parece un valor real (no solo el nombre)
                  if (!value.includes('process.env') && !value.includes('import.meta.env')) {
                    context.report({
                      node,
                      messageId: 'exposedSecret',
                      data: { secret: node.value.substring(0, 20) + '...' }
                    });
                    break;
                  }
                }
              }
            }
          }
        };
      }
    }
  }
};`,
  },
  {
    path: 'packages/shared-utils/src/security/__tests__/dev-server-security.test.ts',
    content: `/**
 * Tests de seguridad para Dev Servers
 * Ataque: esbuild — Dev server accepts arbitrary requests and leaks responses
 */

import { DevServerValidator } from '../validators/dev-server.validator';
import { DevServerSecurityUtils } from '../utils/dev-server-security-utils';
import { DevServerProtector } from '../middleware/dev-server-protector';

describe('Dev Server Security Mitigations', () => {
  describe('DevServerValidator', () => {
    it('should allow secure localhost host', () => {
      const result = DevServerValidator.validateHostConfig('127.0.0.1');
      expect(result.isValid).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should block 0.0.0.0 host', () => {
      const result = DevServerValidator.validateHostConfig('0.0.0.0');
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Host 0.0.0.0 permite conexiones desde cualquier interfaz de red');
    });

    it('should warn about unspecified host', () => {
      const result = DevServerValidator.validateHostConfig(undefined);
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Host no especificado - verificar configuración por defecto');
    });

    it('should validate secure port', () => {
      const result = DevServerValidator.validatePortConfig(3000);
      expect(result.isValid).toBe(false); // 3000 es un puerto común de desarrollo
      expect(result.violations).toContain('Puerto 3000 es un puerto común de desarrollo - alto riesgo si es accesible externamente');
    });

    it('should validate CORS configuration', () => {
      const result = DevServerValidator.validateCorsConfig({ origin: '*' });
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('CORS origin configurado como wildcard (*) - permite requests desde cualquier origen');
    });

    it('should validate complete dev server config', () => {
      const config = {
        host: '0.0.0.0',
        port: 3000,
        cors: { origin: '*' },
        https: false,
        open: true
      };

      const result = DevServerValidator.validateDevServerConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.violations).toHaveLength(5); // host, port, cors, https, open
    });
  });

  describe('DevServerSecurityUtils', () => {
    it('should generate secure Vite config', () => {
      const config = DevServerSecurityUtils.generateSecureViteConfig();
      expect(config).toContain("host: '127.0.0.1'");
      expect(config).toContain('cors: { origin: false }');
      expect(config).toContain('open: false');
    });

    it('should generate secure Next.js config', () => {
      const config = DevServerSecurityUtils.generateSecureNextConfig();
      expect(config).toContain("HOST: '127.0.0.1'");
      expect(config).toContain('X-Frame-Options');
      expect(config).toContain('X-Content-Type-Options');
    });

    it('should generate secure esbuild config', () => {
      const config = DevServerSecurityUtils.generateSecureEsbuildConfig();
      expect(config).toContain("host: '127.0.0.1'");
      expect(config).toContain('onRequest: (args)');
      expect(config).toContain('remoteAddress !== \'127.0.0.1\'');
    });

    it('should generate secure headers', () => {
      const headers = DevServerSecurityUtils.generateSecureHeaders();
      expect(headers).toHaveProperty('X-Frame-Options', 'DENY');
      expect(headers).toHaveProperty('X-Content-Type-Options', 'nosniff');
      expect(headers).toHaveProperty('Content-Security-Policy');
    });

    it('should log security events', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      DevServerSecurityUtils.logSecurityEvent({
        type: 'test_event',
        ip: '192.168.1.100',
        severity: 'HIGH',
        details: { test: true }
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('DEV SERVER SECURITY')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('DevServerProtector', () => {
    it('should allow localhost IPs', () => {
      expect(DevServerProtector.getAllowedIPs()).toContain('127.0.0.1');
      expect(DevServerProtector.getAllowedIPs()).toContain('::1');
    });

    it('should manage allowed IPs', () => {
      const testIP = '192.168.1.100';
      DevServerProtector.addAllowedIP(testIP);
      expect(DevServerProtector.getAllowedIPs()).toContain(testIP);

      DevServerProtector.removeAllowedIP(testIP);
      expect(DevServerProtector.getAllowedIPs()).not.toContain(testIP);
    });

    it('should create Express middleware', () => {
      const middleware = DevServerProtector.createExpressMiddleware();
      expect(typeof middleware).toBe('function');
    });

    it('should create Koa middleware', () => {
      const middleware = DevServerProtector.createKoaMiddleware();
      expect(typeof middleware).toBe('function');
    });

    it('should create Vite plugin', () => {
      const plugin = DevServerProtector.createVitePlugin();
      expect(plugin).toHaveProperty('name', 'dev-server-security');
      expect(plugin).toHaveProperty('configureServer');
    });
  });
});`,
  },
];

// Función para crear archivos
function createFile(filePath, content) {
  const dir = path.dirname(filePath);

  // Crear directorio si no existe
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Escribir archivo
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Creado: ${filePath}`);
}

// Función para actualizar package.json
function updatePackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');

  if (!fs.existsSync(packagePath)) {
    console.log('⚠️  package.json no encontrado, omitiendo actualización');
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  // Agregar script de test para dev server security
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  packageJson.scripts['test:dev-security'] =
    'jest --config packages/shared-utils/jest.config.js --testPathPatterns=dev-server-security';

  // Agregar script de verificación de seguridad
  packageJson.scripts['check:dev-security'] = 'node scripts/check-dev-security.js';

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Package.json actualizado con scripts de seguridad para dev servers');
}

// Función para crear documentación
function createDocumentation() {
  const docsPath = path.join(process.cwd(), 'docs', 'dev-server-security-mitigation.md');

  const documentation = `# Mitigación de Vulnerabilidades en Dev Servers

## Resumen
Este documento describe las mitigaciones implementadas para la vulnerabilidad **esbuild — Dev server accepts arbitrary requests and leaks responses (Moderate)**.

## Arquitectura de Seguridad

### 1. Validadores de Seguridad
- \`DevServerValidator\`: Valida configuraciones de host, puerto y CORS
- \`DevServerSecurityUtils\`: Utilidades para generar configuraciones seguras
- \`DevServerProtector\`: Middleware de protección para diferentes frameworks

### 2. Configuraciones Seguras Generadas
- **Vite**: Configuración con host 127.0.0.1 y CORS restrictivo
- **Next.js**: Headers de seguridad y configuración de desarrollo segura
- **esbuild**: Servidor con logging de requests externos

### 3. Middleware de Protección
- Bloqueo automático de requests desde IPs externas en desarrollo
- Headers de seguridad aplicados automáticamente
- Logging de eventos de seguridad

## Configuraciones Inseguras Detectadas

### Host Configuration
- \`host: '0.0.0.0'\`: Permite conexiones desde cualquier interfaz
- Host no especificado: Puede usar configuración por defecto insegura
- IPs públicas: Accesibles desde internet

### CORS Configuration
- \`origin: '*'\`: Permite requests desde cualquier dominio
- \`credentials: true\`: Permite envío de cookies/autenticación

### Puertos de Desarrollo
Puertos comunes que representan alto riesgo si son accesibles externamente:
- 3000, 3001 (Next.js, Vite)
- 4000, 5000 (Create React App)
- 8000, 8080 (Django, otros)
- 9000, 9090 (Vite, otros)

## Uso en Código

### Vite Configuration
\`\`\`typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { createVitePlugin } from '@a4co/shared-utils';

export default defineConfig({
  plugins: [createVitePlugin()],
  server: {
    host: '127.0.0.1', // ✅ Seguro
    port: 3000,
    cors: false // ✅ Deshabilitar CORS en desarrollo
  }
});
\`\`\`

### Next.js Configuration
\`\`\`typescript
// next.config.js
import { generateSecureNextConfig } from '@a4co/shared-utils';

/** @type {import('next').NextConfig} */
const nextConfig = generateSecureNextConfig();

export default nextConfig;
\`\`\`

### Express.js Middleware
\`\`\`typescript
import express from 'express';
import { DevServerProtector } from '@a4co/shared-utils';

const app = express();

// Agregar protección de dev server
app.use(DevServerProtector.createExpressMiddleware());

app.listen(3000, '127.0.0.1'); // ✅ Solo localhost
\`\`\`

### esbuild Configuration
\`\`\`typescript
import * as esbuild from 'esbuild';
import { generateSecureEsbuildConfig } from '@a4co/shared-utils';

const config = generateSecureEsbuildConfig();
await esbuild.build(config);
\`\`\`

## Verificación de Seguridad

### Ejecutar Verificación Automática
\`\`\`bash
pnpm run check:dev-security
\`\`\`

### Ejecutar Tests de Seguridad
\`\`\`bash
pnpm run test:dev-security
\`\`\`

### Verificación Manual
\`\`\`bash
# Verificar procesos en puertos de desarrollo
netstat -tulpn | grep -E ':(3000|3001|4000|5000|8000|8080|9000|9090) '

# Verificar configuraciones
grep -r "host.*0\\.0\\.0\\.0" .
grep -r "origin.*\\*" .
\`\`\`

## Detección y Monitoreo

### Logs de Seguridad
Los eventos de seguridad se registran automáticamente:

\`\`\`json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "type": "dev_server_security",
  "event": "unauthorized_dev_access",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "url": "/api/config",
  "severity": "HIGH",
  "details": {
    "method": "GET",
    "headers": {
      "host": "localhost:3000",
      "user-agent": "[REDACTED SENSITIVE INFO]"
    }
  }
}
\`\`\`

### Métricas a Monitorear
- Número de requests bloqueados desde IPs externas
- IPs de origen de requests no autorizados
- URLs más accedidas por requests externos
- Tipos de user agents detectados

## Mejores Prácticas

### 1. Configuración de Desarrollo
- **Host**: Siempre usar \`127.0.0.1\` o \`localhost\`
- **Puerto**: Usar puertos no estándar para desarrollo
- **CORS**: Deshabilitar o configurar restrictivamente
- **HTTPS**: Considerar HTTPS local para desarrollo

### 2. Arquitectura de Red
- **Firewall**: Bloquear puertos de desarrollo en nivel de red
- **VPN/Túnel**: Usar SSH port forwarding para acceso remoto
- **Contenedores**: Aislar dev servers en contenedores con networking restringido

### 3. Gestión de Secrets
- **Variables de entorno**: Nunca hardcodear secrets
- **Archivos .env**: No commitear archivos con secrets reales
- **Separación**: Entornos de desarrollo sin acceso a secrets de producción

### 4. Monitoreo Continuo
- **Logs**: Monitorear requests a dev servers
- **Alertas**: Notificaciones automáticas para acceso no autorizado
- **Auditoría**: Revisión periódica de configuraciones

## Casos de Uso Comunes

### Desarrollo Local Seguro
\`\`\`typescript
// ✅ SEGURO: Configuración recomendada
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 3000,
    cors: false,
    open: false
  },
  plugins: [devServerSecurityPlugin()]
});
\`\`\`

### Acceso Remoto Seguro (SSH Tunnel)
\`\`\`bash
# En máquina local
ssh -L 3000:localhost:3000 user@remote-server

# En servidor remoto (desarrollo)
npm run dev -- --host 127.0.0.1 --port 3000
\`\`\`

### Contenedores de Desarrollo
\`\`\`dockerfile
# Dockerfile.dev
FROM node:18
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# docker-compose.dev.yml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "127.0.0.1:3000:3000"  # ✅ Solo localhost
    networks:
      - dev-network

networks:
  dev-network:
    driver: bridge
    internal: true  # ✅ Red interna
\`\`\`

## Respuesta a Incidentes

### Si se detecta acceso no autorizado:
1. **Bloquear**: Agregar IP a lista negra temporal
2. **Investigar**: Revisar logs para entender el vector de ataque
3. **Mitigar**: Cambiar configuración a modo seguro
4. **Notificar**: Alertar al equipo de desarrollo

### Contactos de Emergencia
- Security Team: security@company.com
- DevOps: devops@company.com
- Platform Team: platform@company.com

---

*Esta documentación se actualiza automáticamente con cada cambio en el sistema de seguridad de dev servers.*
`;

  // Crear directorio docs si no existe
  const docsDir = path.dirname(docsPath);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(docsPath, documentation);
  console.log('✅ Documentación de seguridad para dev servers creada');
}

// Función principal
function main() {
  console.log('🔧 Creando validador de configuraciones de Dev Server...');
  createFile(filesToCreate[0].path, filesToCreate[0].content);

  console.log('🛡️ Creando utilidades de seguridad para Dev Servers...');
  createFile(filesToCreate[1].path, filesToCreate[1].content);

  console.log('🔒 Creando protector de middleware para Dev Servers...');
  createFile(filesToCreate[2].path, filesToCreate[2].content);

  console.log('🔍 Agregando reglas de ESLint para Dev Servers...');
  createFile(filesToCreate[3].path, filesToCreate[3].content);

  console.log('🧪 Creando tests de seguridad para Dev Servers...');
  createFile(filesToCreate[4].path, filesToCreate[4].content);

  console.log('📦 Actualizando package.json...');
  updatePackageJson();

  console.log('📚 Creando documentación de seguridad para Dev Servers...');
  createDocumentation();

  console.log('\n✅ Todas las mitigaciones de Dev Servers completadas exitosamente!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Ejecutar: pnpm install');
  console.log('2. Ejecutar tests: pnpm run test:dev-security');
  console.log('3. Verificar configuración: pnpm run check:dev-security');
  console.log('4. Revisar documentación: docs/dev-server-security-mitigation.md');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { main };
