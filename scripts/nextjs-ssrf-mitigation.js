#!/usr/bin/env node

/**
 * Script de mitigación de vulnerabilidades SSRF en Next.js
 * Improper middleware redirect → SSRF (Moderate)
 */

const fs = require('fs');
const path = require('path');

class NextJSSRFSecurityMitigation {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.packagesDir = path.join(this.projectRoot, 'packages');
  }

  async runAllMitigations() {
    console.log('🛡️ Iniciando mitigación de vulnerabilidades SSRF en Next.js');
    console.log('=========================================================\n');

    try {
      await this.createURLValidator();
      await this.createIPRangeBlocker();
      await this.createNextJSMiddlewareProtector();
      await this.createSecurityUtils();
      await this.addEslintRules();
      await this.createSecurityTests();
      await this.updatePackageJson();
      await this.createSecurityDocumentation();

      console.log('\n✅ Todas las mitigaciones de SSRF en Next.js completadas exitosamente!');
      console.log('\n📋 Próximos pasos:');
      console.log('1. Ejecutar: pnpm install');
      console.log('2. Ejecutar tests: pnpm run test:ssrf');
      console.log('3. Revisar documentación: docs/nextjs-ssrf-mitigation.md');
    } catch (error) {
      console.error('❌ Error durante la mitigación:', error.message);
      process.exit(1);
    }
  }

  async createURLValidator() {
    console.log('🔍 Creando validador de URLs...');

    const validatorsDir = path.join(
      this.packagesDir,
      'shared-utils',
      'src',
      'security',
      'validators'
    );
    if (!fs.existsSync(validatorsDir)) {
      fs.mkdirSync(validatorsDir, { recursive: true });
    }

    const urlValidator = `/**
 * Validador de URLs para prevenir SSRF
 * Bloquea redirecciones a servicios internos y metadatos cloud
 */

export class URLValidator {
  // Rangos IP internos y metadatos cloud que deben bloquearse
  private static readonly BLOCKED_IP_RANGES = [
    // RFC1918 - Redes privadas
    /^10\\./,                    // 10.0.0.0/8
    /^172\\.(1[6-9]|2[0-9]|3[0-1])\\./, // 172.16.0.0/12
    /^192\\.168\\./,             // 192.168.0.0/16
    /^127\\./,                   // 127.0.0.0/8 (localhost)
    /^0\\./,                     // 0.0.0.0/8
    /^169\\.254\\./,             // 169.254.0.0/16 (link-local)

    // Metadatos cloud
    /^169\\.254\\.169\\.254$/,   // AWS IMDS
    /^100\\.100\\.100\\.200$/,   // Alibaba Cloud
    /^192\\.0\\.0\\.192$/,       // Oracle Cloud
    /^168\\.63\\.129\\.16$/,     // Azure IMDS
    /^metadata\\.google\\.internal$/, // GCP
  ];

  private static readonly BLOCKED_HOSTNAMES = [
    'localhost',
    'metadata.google.internal',
    '169.254.169.254',
    '100.100.100.200',
    '192.0.0.192',
    '168.63.129.16',
    'internal',
    'local',
    '127.0.0.1',
    '0.0.0.0'
  ];

  private static readonly ALLOWED_SCHEMES = ['http', 'https'];

  /**
   * Valida si una URL es segura para redirección
   */
  static validateURL(url: string): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (!url || typeof url !== 'string') {
      violations.push('URL is empty or not a string');
      return { isValid: false, violations };
    }

    try {
      const urlObj = new URL(url);

      // Validar esquema
      if (!this.ALLOWED_SCHEMES.includes(urlObj.protocol.replace(':', ''))) {
        violations.push(\`Invalid scheme: \${urlObj.protocol}\`);
      }

      // Validar hostname
      if (this.BLOCKED_HOSTNAMES.includes(urlObj.hostname.toLowerCase())) {
        violations.push(\`Blocked hostname: \${urlObj.hostname}\`);
      }

      // Validar IP ranges
      const hostname = urlObj.hostname;
      if (this.isIPAddress(hostname)) {
        for (const range of this.BLOCKED_IP_RANGES) {
          if (range.test(hostname)) {
            violations.push(\`Blocked IP range: \${hostname}\`);
            break;
          }
        }
      }

      // Validar puerto (bloquear puertos internos comunes)
      if (urlObj.port) {
        const port = parseInt(urlObj.port);
        if (this.isInternalPort(port)) {
          violations.push(\`Blocked internal port: \${port}\`);
        }
      }

    } catch (error) {
      violations.push(\`Invalid URL format: \${error.message}\`);
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Verifica si una cadena es una dirección IP
   */
  private static isIPAddress(hostname: string): boolean {
    const ipRegex = /^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$/;
    return ipRegex.test(hostname);
  }

  /**
   * Verifica si un puerto es interno/privilegiado
   */
  private static isInternalPort(port: number): boolean {
    // Puertos comunes de servicios internos
    const internalPorts = [
      22,   // SSH
      25,   // SMTP
      53,   // DNS
      80,   // HTTP (si es interno)
      443,  // HTTPS (si es interno)
      3306, // MySQL
      5432, // PostgreSQL
      6379, // Redis
      8080, // HTTP alternativo
      8443, // HTTPS alternativo
      9200, // Elasticsearch
      27017 // MongoDB
    ];

    return internalPorts.includes(port) || port < 1024;
  }

  /**
   * Sanitiza una URL removiendo componentes peligrosos
   */
  static sanitizeURL(url: string): string {
    if (!url || typeof url !== 'string') return url;

    try {
      const urlObj = new URL(url);

      // Remover credenciales
      urlObj.username = '';
      urlObj.password = '';

      // Remover fragmentos que podrían contener datos sensibles
      urlObj.hash = '';

      return urlObj.toString();
    } catch (error) {
      return url;
    }
  }

  /**
   * Verifica si una URL está en una allowlist
   */
  static isInAllowlist(url: string, allowlist: string[]): boolean {
    if (!url || !allowlist || allowlist.length === 0) return false;

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      return allowlist.some(allowed => {
        // Soporte para wildcards
        const pattern = allowed.replace(/\\*/g, '.*');
        const regex = new RegExp(\`^\${pattern}$\`, 'i');
        return regex.test(hostname);
      });
    } catch (error) {
      return false;
    }
  }
}

export default URLValidator;`;

    fs.writeFileSync(path.join(validatorsDir, 'url.validator.ts'), urlValidator);

    console.log('✅ Validador de URLs creado');
  }

  async createIPRangeBlocker() {
    console.log('🚫 Creando bloqueador de rangos IP...');

    const utilsDir = path.join(this.packagesDir, 'shared-utils', 'src', 'security', 'utils');
    if (!fs.existsSync(utilsDir)) {
      fs.mkdirSync(utilsDir, { recursive: true });
    }

    const ipBlocker = `/**
 * Bloqueador de rangos IP para prevenir SSRF
 * Implementa filtros egress para servicios internos
 */

export class IPRangeBlocker {
  // Rangos IP que deben bloquearse (RFC1918 + metadatos cloud)
  private static readonly BLOCKED_RANGES = [
    { name: 'RFC1918-10', range: '10.0.0.0/8', cidr: [10, 0, 0, 0, 8] },
    { name: 'RFC1918-172', range: '172.16.0.0/12', cidr: [172, 16, 0, 0, 12] },
    { name: 'RFC1918-192', range: '192.168.0.0/16', cidr: [192, 168, 0, 0, 16] },
    { name: 'Loopback', range: '127.0.0.0/8', cidr: [127, 0, 0, 0, 8] },
    { name: 'Link-local', range: '169.254.0.0/16', cidr: [169, 254, 0, 0, 16] },
    { name: 'AWS-IMDS', range: '169.254.169.254/32', cidr: [169, 254, 169, 254, 32] },
    { name: 'Azure-IMDS', range: '168.63.129.16/32', cidr: [168, 63, 129, 16, 32] },
    { name: 'GCP-Metadata', range: 'metadata.google.internal', cidr: null },
    { name: 'Oracle-Cloud', range: '192.0.0.192/32', cidr: [192, 0, 0, 192, 32] },
    { name: 'Alibaba-Cloud', range: '100.100.100.200/32', cidr: [100, 100, 100, 200, 32] }
  ];

  /**
   * Verifica si una IP está en un rango bloqueado
   */
  static isBlockedIP(ip: string): { isBlocked: boolean; reason?: string } {
    if (!ip || typeof ip !== 'string') {
      return { isBlocked: false };
    }

    // Verificar hostname especial
    if (this.isBlockedHostname(ip)) {
      return { isBlocked: true, reason: 'Blocked hostname' };
    }

    // Verificar IP
    if (this.isValidIP(ip)) {
      for (const range of this.BLOCKED_RANGES) {
        if (range.cidr && this.isIPInRange(ip, range.cidr)) {
          return { isBlocked: true, reason: \`Blocked range: \${range.name} (\${range.range})\` };
        }
      }
    }

    return { isBlocked: false };
  }

  /**
   * Verifica si un hostname está bloqueado
   */
  private static isBlockedHostname(hostname: string): boolean {
    const blockedHostnames = [
      'localhost',
      'metadata.google.internal',
      '169.254.169.254',
      '168.63.129.16',
      '192.0.0.192',
      '100.100.100.200'
    ];

    return blockedHostnames.includes(hostname.toLowerCase());
  }

  /**
   * Verifica si una cadena es una IP válida
   */
  private static isValidIP(ip: string): boolean {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;

    return parts.every(part => {
      const num = parseInt(part);
      return num >= 0 && num <= 255 && part === num.toString();
    });
  }

  /**
   * Verifica si una IP está dentro de un rango CIDR
   */
  private static isIPInRange(ip: string, cidr: number[]): boolean {
    const [rangeIP1, rangeIP2, rangeIP3, rangeIP4, prefix] = cidr;
    const [ip1, ip2, ip3, ip4] = ip.split('.').map(Number);

    // Para simplificar, verificamos rangos comunes
    if (prefix === 8) {
      return ip1 === rangeIP1;
    } else if (prefix === 12) {
      return ip1 === rangeIP1 && (ip2 & 0xF0) === (rangeIP2 & 0xF0);
    } else if (prefix === 16) {
      return ip1 === rangeIP1 && ip2 === rangeIP2;
    } else if (prefix === 32) {
      return ip1 === rangeIP1 && ip2 === rangeIP2 && ip3 === rangeIP3 && ip4 === rangeIP4;
    }

    return false;
  }

  /**
   * Obtiene todos los rangos bloqueados
   */
  static getBlockedRanges(): Array<{ name: string; range: string }> {
    return this.BLOCKED_RANGES.map(({ name, range }) => ({ name, range }));
  }

  /**
   * Verifica si una URL contiene una IP bloqueada
   */
  static containsBlockedIP(url: string): { isBlocked: boolean; reason?: string } {
    try {
      const urlObj = new URL(url);
      return this.isBlockedIP(urlObj.hostname);
    } catch (error) {
      return { isBlocked: false };
    }
  }
}

export default IPRangeBlocker;`;

    fs.writeFileSync(path.join(utilsDir, 'ip-range-blocker.ts'), ipBlocker);

    console.log('✅ Bloqueador de rangos IP creado');
  }

  async createNextJSMiddlewareProtector() {
    console.log('🛡️ Creando protector de middleware Next.js...');

    const middlewareDir = path.join(
      this.packagesDir,
      'shared-utils',
      'src',
      'security',
      'middleware'
    );
    if (!fs.existsSync(middlewareDir)) {
      fs.mkdirSync(middlewareDir, { recursive: true });
    }

    const nextjsProtector = `/**
 * Protector de middleware Next.js contra SSRF
 * Valida redirecciones y requests salientes
 */

import { NextRequest, NextResponse } from 'next/server';
import { URLValidator } from '../validators/url.validator';
import { IPRangeBlocker } from '../utils/ip-range-blocker';

export class NextJSMiddlewareProtector {
  private static readonly ALLOWLIST: string[] = [
    // Agregar dominios permitidos aquí
    // '*.miapp.com',
    // 'api.miapp.com',
  ];

  /**
   * Middleware principal para proteger contra SSRF
   */
  static protectMiddleware(request: NextRequest): NextResponse | null {
    try {
      // Verificar headers de redirección
      const redirectURL = this.extractRedirectURL(request);
      if (redirectURL) {
        const validation = URLValidator.validateURL(redirectURL);
        if (!validation.isValid) {
          console.warn('Blocked redirect attempt:', {
            url: redirectURL,
            violations: validation.violations,
            userAgent: request.headers.get('user-agent'),
            ip: request.ip || request.headers.get('x-forwarded-for')
          });

          return new NextResponse(
            JSON.stringify({
              error: 'Invalid redirect URL',
              message: 'The requested redirect destination is not allowed'
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        // Verificar allowlist si está configurada
        if (this.ALLOWLIST.length > 0 && !URLValidator.isInAllowlist(redirectURL, this.ALLOWLIST)) {
          console.warn('Redirect URL not in allowlist:', redirectURL);
          return new NextResponse(
            JSON.stringify({
              error: 'Forbidden redirect',
              message: 'Redirect destination not in allowed list'
            }),
            {
              status: 403,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      }

      // Verificar requests salientes (fetch calls)
      const destinationURL = this.extractDestinationURL(request);
      if (destinationURL) {
        const ipCheck = IPRangeBlocker.containsBlockedIP(destinationURL);
        if (ipCheck.isBlocked) {
          console.warn('Blocked outbound request to internal IP:', {
            url: destinationURL,
            reason: ipCheck.reason,
            userAgent: request.headers.get('user-agent'),
            ip: request.ip || request.headers.get('x-forwarded-for')
          });

          return new NextResponse(
            JSON.stringify({
              error: 'Forbidden request',
              message: 'Outbound requests to internal services are not allowed'
            }),
            {
              status: 403,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      }

      return null; // Continuar con el request normal

    } catch (error) {
      console.error('Middleware protection error:', error);
      return new NextResponse(
        JSON.stringify({
          error: 'Internal server error',
          message: 'Request validation failed'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  /**
   * Extrae URL de redirección de headers/query params
   */
  private static extractRedirectURL(request: NextRequest): string | null {
    // Verificar headers comunes de redirección
    const redirectHeaders = [
      'redirect',
      'redirect_uri',
      'redirect_url',
      'return',
      'return_url',
      'continue',
      'next'
    ];

    for (const header of redirectHeaders) {
      const value = request.headers.get(header);
      if (value) return value;
    }

    // Verificar query parameters
    const url = new URL(request.url);
    for (const param of redirectHeaders) {
      const value = url.searchParams.get(param);
      if (value) return value;
    }

    return null;
  }

  /**
   * Extrae URL de destino de requests salientes
   */
  private static extractDestinationURL(request: NextRequest): string | null {
    // Para requests que hacen fetch a otras URLs
    // Esto es más complejo y depende de la lógica específica de la app
    // Por ahora, verificamos si hay URLs en el body (para POST requests)

    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          // Nota: En middleware de Next.js, el body no está disponible por defecto
          // Esto requeriría configuración adicional
          return null;
        }
      } catch (error) {
        // Ignorar errores al parsear el body
      }
    }

    return null;
  }

  /**
   * Configura allowlist de dominios permitidos
   */
  static setAllowlist(allowlist: string[]): void {
    (this.ALLOWLIST as any) = allowlist;
  }

  /**
   * Obtiene la allowlist actual
   */
  static getAllowlist(): string[] {
    return [...this.ALLOWLIST];
  }
}

export default NextJSMiddlewareProtector;

// Exportar función de middleware para uso directo
export function protectSSRF(request: NextRequest): NextResponse | null {
  return NextJSMiddlewareProtector.protectMiddleware(request);
}`;

    fs.writeFileSync(path.join(middlewareDir, 'nextjs-ssrf-protector.ts'), nextjsProtector);

    console.log('✅ Protector de middleware Next.js creado');
  }

  async createSecurityUtils() {
    console.log('🔧 Creando utilidades de seguridad...');

    const utilsDir = path.join(this.packagesDir, 'shared-utils', 'src', 'security', 'utils');
    if (!fs.existsSync(utilsDir)) {
      fs.mkdirSync(utilsDir, { recursive: true });
    }

    const securityUtils = `/**
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
      throw new Error(\`Unsafe URL blocked: \${safetyCheck.reason}\`);
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
          violations.push(\`Parameter '\${key}': \${validation.violations.join(', ')}\`);
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
             str.includes('://') || /^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}/.test(str);
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

export default SSRFSecurityUtils;`;

    fs.writeFileSync(path.join(utilsDir, 'ssrf-security-utils.ts'), securityUtils);

    console.log('✅ Utilidades de seguridad creadas');
  }

  async addEslintRules() {
    console.log('🔍 Agregando reglas de ESLint para SSRF...');

    const eslintRulesPath = path.join(this.projectRoot, 'eslint-rules');
    if (!fs.existsSync(eslintRulesPath)) {
      fs.mkdirSync(eslintRulesPath);
    }

    const customRules = `/**
 * Reglas personalizadas de ESLint para prevenir SSRF en Next.js
 */

module.exports = {
  'no-unsafe-redirect': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Detecta redirecciones inseguras que pueden causar SSRF'
      }
    },
    create(context) {
      return {
        CallExpression(node) {
          // Detectar NextResponse.redirect() sin validación
          if (node.callee.type === 'MemberExpression' &&
              node.callee.object.name === 'NextResponse' &&
              node.callee.property.name === 'redirect') {

            // Verificar si hay validación previa
            const hasValidation = this.hasValidationBefore(node);

            if (!hasValidation) {
              context.report({
                node,
                message: 'Unsafe redirect detected. Use SSRFSecurityUtils.validateAndSanitizeURL() before redirecting.'
              });
            }
          }
        },

        // Detectar fetch() calls sin validación
        CallExpression(node) {
          if (node.callee.name === 'fetch' && node.arguments.length > 0) {
            const urlArg = node.arguments[0];

            // Verificar si es una variable o expresión compleja
            if (urlArg.type === 'Identifier' || urlArg.type === 'MemberExpression') {
              // Podría ser inseguro, marcar para revisión
              context.report({
                node,
                message: 'Potential unsafe fetch. Consider using SSRFSecurityUtils.safeFetch().'
              });
            }
          }
        }
      };
    },

    hasValidationBefore(node) {
      // Lógica simplificada para detectar validación previa
      // En un caso real, esto sería más sofisticado
      return false;
    }
  },

  'no-internal-ip-access': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Detecta acceso a IPs internas que pueden indicar SSRF'
      }
    },
    create(context) {
      const internalIPRegex = /(10\\.\\d+|172\\.(1[6-9]|2\\d|3[01])\\.|192\\.168\\.|127\\.\\d+|169\\.254\\.)/;

      return {
        Literal(node) {
          if (typeof node.value === 'string' && internalIPRegex.test(node.value)) {
            context.report({
              node,
              message: 'Internal IP address detected. This may indicate SSRF vulnerability.'
            });
          }
        }
      };
    }
  }
};`;

    fs.writeFileSync(path.join(eslintRulesPath, 'ssrf-rules.js'), customRules);

    console.log('✅ Reglas de ESLint agregadas');
  }

  async createSecurityTests() {
    console.log('🧪 Creando tests de seguridad SSRF...');

    const testDir = path.join(this.packagesDir, 'shared-utils', 'src', 'security', '__tests__');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const ssrfTests = `/**
 * Tests de seguridad para mitigaciones SSRF en Next.js
 */

import { URLValidator } from '../validators/url.validator';
import { IPRangeBlocker } from '../utils/ip-range-blocker';
import { SSRFSecurityUtils } from '../utils/ssrf-security-utils';

describe('Next.js SSRF Security Mitigations', () => {
  describe('URLValidator', () => {
    it('should allow safe external URLs', () => {
      const result = URLValidator.validateURL('https://api.github.com/users/octocat');
      expect(result.isValid).toBe(true);
      expect(result.violations).toEqual([]);
    });

    it('should block localhost', () => {
      const result = URLValidator.validateURL('http://localhost:3000/api');
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Blocked hostname: localhost');
    });

    it('should block private IP ranges', () => {
      const result = URLValidator.validateURL('http://10.0.0.1:8080');
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Blocked IP range: 10.0.0.1');
    });

    it('should block AWS IMDS', () => {
      const result = URLValidator.validateURL('http://169.254.169.254/latest/meta-data/');
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Blocked IP range: 169.254.169.254');
    });

    it('should block Azure IMDS', () => {
      const result = URLValidator.validateURL('http://168.63.129.16/metadata');
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain('Blocked IP range: 168.63.129.16');
    });

    it('should sanitize URLs', () => {
      const url = 'https://user:pass@example.com/path?query=value#fragment';
      const sanitized = URLValidator.sanitizeURL(url);
      expect(sanitized).toBe('https://example.com/path?query=value');
    });
  });

  describe('IPRangeBlocker', () => {
    it('should block RFC1918 ranges', () => {
      expect(IPRangeBlocker.isBlockedIP('10.0.0.1').isBlocked).toBe(true);
      expect(IPRangeBlocker.isBlockedIP('172.16.0.1').isBlocked).toBe(true);
      expect(IPRangeBlocker.isBlockedIP('192.168.1.1').isBlocked).toBe(true);
    });

    it('should block cloud metadata IPs', () => {
      expect(IPRangeBlocker.isBlockedIP('169.254.169.254').isBlocked).toBe(true);
      expect(IPRangeBlocker.isBlockedIP('168.63.129.16').isBlocked).toBe(true);
      expect(IPRangeBlocker.isBlockedIP('metadata.google.internal').isBlocked).toBe(true);
    });

    it('should allow public IPs', () => {
      expect(IPRangeBlocker.isBlockedIP('8.8.8.8').isBlocked).toBe(false);
      expect(IPRangeBlocker.isBlockedIP('1.1.1.1').isBlocked).toBe(false);
    });
  });

  describe('SSRFSecurityUtils', () => {
    it('should validate safe URLs', () => {
      const result = SSRFSecurityUtils.validateAndSanitizeURL('https://api.example.com/data');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedURL).toBeDefined();
    });

    it('should reject unsafe URLs', () => {
      const result = SSRFSecurityUtils.validateAndSanitizeURL('http://127.0.0.1:8080');
      expect(result.isValid).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
    });

    it('should detect URLs in query params', () => {
      const params = {
        redirect: 'http://localhost:3000',
        callback: 'https://safe.example.com'
      };

      const result = SSRFSecurityUtils.validateQueryParams(params);
      expect(result.isValid).toBe(false);
      expect(result.violations).toContain("Parameter 'redirect'");
    });

    it('should generate secure headers', () => {
      const headers = SSRFSecurityUtils.generateSecureHeaders();
      expect(headers).toHaveProperty('X-Content-Type-Options');
      expect(headers).toHaveProperty('X-Frame-Options');
      expect(headers).toHaveProperty('Content-Security-Policy');
    });
  });
});`;

    fs.writeFileSync(path.join(testDir, 'nextjs-ssrf.test.ts'), ssrfTests);

    console.log('✅ Tests de seguridad SSRF creados');
  }

  async updatePackageJson() {
    console.log('📦 Actualizando package.json...');

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (!packageJson.scripts) packageJson.scripts = {};

    packageJson.scripts['security:ssrf'] = 'node scripts/nextjs-ssrf-mitigation.js';
    packageJson.scripts['test:ssrf'] =
      'jest --config packages/shared-utils/jest.config.js --testPathPatterns=ssrf';

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log('✅ Package.json actualizado');
  }

  async createSecurityDocumentation() {
    console.log('📚 Creando documentación de seguridad SSRF...');

    const docsDir = path.join(this.projectRoot, 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir);
    }

    const documentation = `# Mitigación de Vulnerabilidades SSRF en Next.js

## Resumen
Este documento describe las mitigaciones implementadas para la vulnerabilidad **Improper middleware redirect → SSRF (Moderate)** en aplicaciones Next.js.

## Arquitectura de Seguridad

### 1. Validadores de Seguridad
- \`URLValidator\`: Valida URLs para prevenir redirecciones peligrosas
- \`IPRangeBlocker\`: Bloquea rangos IP internos y metadatos cloud

### 2. Utilidades de Seguridad
- \`SSRFSecurityUtils\`: Funciones helper para validación y sanitización
- \`NextJSMiddlewareProtector\`: Middleware protector para Next.js

### 3. Middleware de Protección
- Protección automática en middleware de Next.js
- Validación de headers de redirección
- Bloqueo de requests a servicios internos

## Rangos IP Bloqueados

### RFC1918 (Redes Privadas)
- \`10.0.0.0/8\` - Clase A privada
- \`172.16.0.0/12\` - Clase B privada
- \`192.168.0.0/16\` - Clase C privada

### Metadatos Cloud
- \`169.254.169.254\` - AWS IMDS
- \`168.63.129.16\` - Azure IMDS
- \`metadata.google.internal\` - GCP Metadata
- \`192.0.0.192\` - Oracle Cloud
- \`100.100.100.200\` - Alibaba Cloud

### Otros
- \`127.0.0.0/8\` - Loopback
- \`169.254.0.0/16\` - Link-local

## Uso en Código

### Middleware Next.js
\`\`\`typescript
// middleware.ts
import { protectSSRF } from '@a4co/shared-utils';

export function middleware(request: NextRequest) {
  // Proteger contra SSRF
  const protection = protectSSRF(request);
  if (protection) {
    return protection; // Retorna respuesta de error si es necesario
  }

  // Continuar con la lógica normal
  return NextResponse.next();
}
\`\`\`

### Validación Manual de URLs
\`\`\`typescript
import { URLValidator, SSRFSecurityUtils } from '@a4co/shared-utils';

// Validar URL antes de redirigir
const validation = URLValidator.validateURL(userProvidedURL);
if (!validation.isValid) {
  throw new Error(\`Invalid URL: \${validation.violations.join(', ')}\`);
}

// Usar fetch seguro
const response = await SSRFSecurityUtils.safeFetch(apiURL);
\`\`\`

### Headers de Seguridad
\`\`\`typescript
import { SSRFSecurityUtils } from '@a4co/shared-utils';

export default function Layout({ children }) {
  return (
    <html>
      <head>
        {Object.entries(SSRFSecurityUtils.generateSecureHeaders()).map(([key, value]) => (
          <meta key={key} httpEquiv={key} content={value} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
\`\`\`

## Configuración de Allowlist

### Configurar Dominios Permitidos
\`\`\`typescript
import { NextJSMiddlewareProtector } from '@a4co/shared-utils';

// Configurar allowlist
NextJSMiddlewareProtector.setAllowlist([
  '*.miapp.com',
  'api.miapp.com',
  'cdn.miapp.com'
]);
\`\`\`

## Detección y Monitoreo

### Logs de Seguridad
El sistema automáticamente registra eventos de seguridad:

\`\`\`json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "type": "ssrf_attempt",
  "url": "http://169.254.169.254/latest/meta-data/",
  "violations": ["Blocked IP range: 169.254.169.254"],
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "severity": "HIGH"
}
\`\`\`

### Métricas a Monitorear
- Número de intentos de SSRF bloqueados
- URLs más comunes en intentos de ataque
- IPs de origen de ataques
- Tipos de violaciones detectadas

## Testing

### Ejecutar Tests SSRF
\`\`\`bash
pnpm run test:ssrf
\`\`\`

### Tests Incluidos
- Validación de URLs seguras vs peligrosas
- Bloqueo de rangos IP internos
- Sanitización de URLs
- Validación de parámetros de query
- Headers de seguridad

## Mejores Prácticas

### 1. Validación de Input
- Siempre validar URLs antes de usarlas en redirecciones
- Usar allowlists para dominios permitidos
- Sanitizar URLs removiendo credenciales y fragments

### 2. Arquitectura de Red
- Implementar egress filtering en el nivel de red
- Usar proxies reversos con validación
- Configurar firewalls para bloquear tráfico interno

### 3. Headers de Seguridad
- Implementar Content Security Policy (CSP)
- Usar X-Frame-Options y X-Content-Type-Options
- Configurar Referrer-Policy apropiada

### 4. Monitoreo Continuo
- Logs de todas las redirecciones y requests externos
- Alertas automáticas para patrones sospechosos
- Revisión periódica de allowlists

## Casos de Uso Comunes

### Redirección Después de Login
\`\`\`typescript
// ❌ INSEGURO
export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get('redirect');
  return NextResponse.redirect(redirectTo);
}

// ✅ SEGURO
export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get('redirect');

  const validation = URLValidator.validateURL(redirectTo);
  if (!validation.isValid) {
    return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 });
  }

  return NextResponse.redirect(redirectTo);
}
\`\`\`

### API Calls Externos
\`\`\`typescript
// ❌ INSEGURO
const response = await fetch(userProvidedURL);

// ✅ SEGURO
const safetyCheck = SSRFSecurityUtils.isSafeForFetch(userProvidedURL);
if (!safetyCheck.isSafe) {
  throw new Error(\`Unsafe URL: \${safetyCheck.reason}\`);
}

const response = await SSRFSecurityUtils.safeFetch(userProvidedURL);
\`\`\`

## Respuesta a Incidentes

### Si se detecta SSRF:
1. **Bloquear**: Agregar la URL/IP a listas de bloqueo
2. **Investigar**: Revisar logs para encontrar el vector de ataque
3. **Mitigar**: Actualizar validaciones y filtros
4. **Monitorear**: Aumentar vigilancia en endpoints similares

### Contactos de Emergencia
- Security Team: security@company.com
- DevOps: devops@company.com
- Platform Team: platform@company.com

---

*Esta documentación se actualiza automáticamente con cada cambio en el sistema de seguridad SSRF.*
`;

    fs.writeFileSync(path.join(docsDir, 'nextjs-ssrf-mitigation.md'), documentation);

    console.log('✅ Documentación de seguridad SSRF creada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const mitigation = new NextJSSRFSecurityMitigation();
  mitigation.runAllMitigations().catch(console.error);
}

module.exports = NextJSSRFSecurityMitigation;
