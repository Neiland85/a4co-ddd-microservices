/**
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
      expect(config).toContain('remoteAddress !== '127.0.0.1'');
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
});