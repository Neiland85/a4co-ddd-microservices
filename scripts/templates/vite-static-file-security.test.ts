/**
 * Vite Static File Security Test Suite
 * Comprehensive tests for Vite static file serving security mitigations
 */

import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ViteStaticFileProtector } from '../middleware/vite-static-file-protector';
import { SafeViteStaticServer } from '../utils/safe-vite-static-server';
import { ViteStaticPathValidator } from '../validators/vite-static-path.validator';

describe('ViteStaticPathValidator', () => {
  let validator: ViteStaticPathValidator;

  beforeEach(() => {
    validator = new ViteStaticPathValidator({
      allowedExtensions: ['.js', '.css', '.png', '.jpg', '.svg'],
      blockedDirectories: ['node_modules', '.git', '.env'],
      blockedFiles: ['package.json', '.env.local', 'config.json'],
    });
  });

  describe('validatePath', () => {
    it('should allow safe paths', () => {
      expect(validator.validatePath('/public/assets/app.js')).toBe(true);
      expect(validator.validatePath('/public/images/logo.png')).toBe(true);
      expect(validator.validatePath('/public/styles/main.css')).toBe(true);
    });

    it('should block directory traversal attempts', () => {
      expect(validator.validatePath('../../../etc/passwd')).toBe(false);
      expect(validator.validatePath('..\\..\\windows\\system32\\config')).toBe(false);
      expect(validator.validatePath('%2e%2e%2f%2e%2e%2fetc%2fpasswd')).toBe(false);
    });

    it('should block sensitive directories', () => {
      expect(validator.validatePath('/node_modules/lodash/index.js')).toBe(false);
      expect(validator.validatePath('/.git/config')).toBe(false);
      expect(validator.validatePath('/.env')).toBe(false);
    });

    it('should block sensitive files', () => {
      expect(validator.validatePath('/package.json')).toBe(false);
      expect(validator.validatePath('/.env.local')).toBe(false);
      expect(validator.validatePath('/config.json')).toBe(false);
    });

    it('should block unauthorized extensions', () => {
      expect(validator.validatePath('/public/assets/config.html')).toBe(false);
      expect(validator.validatePath('/public/data/secrets.json')).toBe(false);
      expect(validator.validatePath('/public/logs/app.log')).toBe(false);
    });

    it('should handle encoded paths', () => {
      expect(validator.validatePath('/public/assets/app%2ejs')).toBe(false); // encoded .js
      expect(validator.validatePath('/public/%2e%2e%2fetc%2fpasswd')).toBe(false); // encoded traversal
    });
  });

  describe('validatePaths', () => {
    it('should validate multiple paths', () => {
      const paths = [
        '/public/assets/app.js',
        '../../../etc/passwd',
        '/node_modules/lodash/index.js',
        '/public/images/logo.png',
      ];

      const results = validator.validatePaths(paths);
      expect(results).toEqual([true, false, false, true]);
    });
  });

  describe('sanitizePath', () => {
    it('should normalize paths', () => {
      expect(validator.sanitizePath('/public/assets/../styles/main.css')).toBe(
        '/public/styles/main.css'
      );
      expect(validator.sanitizePath('/public/assets/./app.js')).toBe('/public/assets/app.js');
    });

    it('should decode URL encoding', () => {
      expect(validator.sanitizePath('/public/assets/app%2ejs')).toBe('/public/assets/app.js');
      expect(validator.sanitizePath('/public/images/logo%20icon.png')).toBe(
        '/public/images/logo icon.png'
      );
    });

    it('should prevent directory traversal in sanitization', () => {
      expect(validator.sanitizePath('../../../etc/passwd')).toBe('/etc/passwd');
      expect(validator.sanitizePath('..\\..\\windows\\system32')).toBe('/windows/system32');
    });
  });

  describe('shouldBlockPath', () => {
    it('should identify blocked paths', () => {
      expect(validator.shouldBlockPath('/node_modules/lodash/index.js')).toBe(true);
      expect(validator.shouldBlockPath('/.git/config')).toBe(true);
      expect(validator.shouldBlockPath('/package.json')).toBe(true);
      expect(validator.shouldBlockPath('/public/assets/app.js')).toBe(false);
    });
  });
});

describe('ViteStaticFileProtector', () => {
  let protector: ViteStaticFileProtector;
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    protector = new ViteStaticFileProtector({
      validator: new ViteStaticPathValidator({
        allowedExtensions: ['.js', '.css', '.png'],
        blockedDirectories: ['node_modules', '.git'],
        blockedFiles: ['package.json'],
      }),
      logBlockedRequests: true,
      customErrorMessage: 'Access denied',
    });

    mockRequest = {
      url: '/public/assets/app.js',
      method: 'GET',
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('protect', () => {
    it('should allow safe requests', () => {
      mockRequest.url = '/public/assets/app.js';
      protector.protect(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should block directory traversal', () => {
      mockRequest.url = '../../../etc/passwd';
      protector.protect(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.send).toHaveBeenCalledWith('Access denied');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should block sensitive directories', () => {
      mockRequest.url = '/node_modules/lodash/index.js';
      protector.protect(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should block unauthorized extensions', () => {
      mockRequest.url = '/public/assets/config.html';
      protector.protect(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('expressMiddleware', () => {
    it('should work as Express middleware', () => {
      const middleware = protector.expressMiddleware();
      middleware(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('statistics', () => {
    it('should track blocked requests', () => {
      mockRequest.url = '../../../etc/passwd';
      protector.protect(mockRequest, mockResponse, mockNext);

      const stats = protector.getStatistics();
      expect(stats.blockedRequests).toBe(1);
      expect(stats.totalRequests).toBe(1);
    });
  });
});

describe('SafeViteStaticServer', () => {
  let safeServer: SafeViteStaticServer;
  let mockViteServer: any;

  beforeEach(() => {
    mockViteServer = {
      middlewares: {
        use: jest.fn(),
      },
      ws: {
        send: jest.fn(),
      },
    };

    safeServer = new SafeViteStaticServer({
      root: '/app/public',
      validator: new ViteStaticPathValidator({
        allowedExtensions: ['.js', '.css', '.png'],
        blockedDirectories: ['node_modules'],
      }),
      protector: new ViteStaticFileProtector({
        validator: new ViteStaticPathValidator(),
      }),
    });
  });

  describe('serveFile', () => {
    it('should serve safe files', async () => {
      const mockReq = { url: '/assets/app.js' };
      const mockRes = { sendFile: jest.fn() };

      await safeServer.serveFile(mockReq as any, mockRes as any);
      expect(mockRes.sendFile).toHaveBeenCalledWith('/app/public/assets/app.js');
    });

    it('should reject unsafe files', async () => {
      const mockReq = { url: '../../../etc/passwd' };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await safeServer.serveFile(mockReq as any, mockRes as any);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.send).toHaveBeenCalledWith('Access denied');
    });
  });

  describe('createVitePlugin', () => {
    it('should create a Vite plugin', () => {
      const plugin = safeServer.createVitePlugin();
      expect(plugin.name).toBe('vite-static-file-security');
      expect(typeof plugin.configureServer).toBe('function');
    });

    it('should configure server with middleware', () => {
      const plugin = safeServer.createVitePlugin();
      plugin.configureServer(mockViteServer);
      expect(mockViteServer.middlewares.use).toHaveBeenCalled();
    });
  });

  describe('createExpressMiddleware', () => {
    it('should create Express middleware', () => {
      const middleware = safeServer.createExpressMiddleware();
      expect(typeof middleware).toBe('function');
    });
  });
});

describe('Integration Tests', () => {
  it('should work end-to-end with Vite plugin', () => {
    const validator = new ViteStaticPathValidator({
      allowedExtensions: ['.js', '.css'],
      blockedDirectories: ['node_modules', '.git'],
    });

    const protector = new ViteStaticFileProtector({
      validator,
      logBlockedRequests: true,
    });

    const safeServer = new SafeViteStaticServer({
      root: '/app/public',
      validator,
      protector,
    });

    const plugin = safeServer.createVitePlugin();

    // Simulate Vite server setup
    const mockServer = {
      middlewares: {
        use: jest.fn(),
      },
    };

    plugin.configureServer(mockServer);
    expect(mockServer.middlewares.use).toHaveBeenCalled();
  });

  it('should handle various attack vectors', () => {
    const validator = new ViteStaticPathValidator({
      allowedExtensions: ['.js', '.css', '.png'],
      blockedDirectories: ['node_modules', '.git', '.env'],
      blockedFiles: ['package.json', '.env.local'],
    });

    const attackVectors = [
      '../../../etc/passwd',
      '..\\..\\windows\\system32\\config',
      '%2e%2e%2f%2e%2e%2fetc%2fpasswd',
      '/node_modules/lodash/index.js',
      '/.git/config',
      '/.env',
      '/package.json',
      '/public/assets/config.html',
      '/public/data/secrets.json',
    ];

    attackVectors.forEach(vector => {
      expect(validator.validatePath(vector)).toBe(false);
    });
  });
});
