// Import opcional para observabilidad (fallback a console si no está disponible)
let logger: any;
try {
  const observability = require('@a4co/observability');
  logger = observability.getGlobalLogger();
} catch {
  logger = {
    info: console.info,
    warn: console.warn,
    error: console.error,
  };
}

import { ViteStaticFileProtector } from '../middleware/vite-static-file-protector';
import {
  StaticFileConfig,
  ViteStaticPathValidator,
} from '../validators/vite-static-path.validator';

/**
 * Safe Vite Static Server
 * Provides secure static file serving with access control
 */

export interface ViteStaticServerOptions extends StaticFileConfig {
  root?: string;
  enableProtection?: boolean;
  logAccess?: boolean;
  customValidator?: (path: string) => boolean;
}

export interface FileServeResult {
  allowed: boolean;
  path?: string;
  error?: string;
  blockedReason?: string;
}

export class SafeViteStaticServer {
  private protector: ViteStaticFileProtector;
  private options: ViteStaticServerOptions;
  private root: string;

  constructor(options: ViteStaticServerOptions = {}) {
    this.options = {
      root: process.cwd(),
      enableProtection: true,
      logAccess: true,
      allowedExtensions: [
        '.js',
        '.css',
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.svg',
        '.ico',
        '.woff',
        '.woff2',
        '.ttf',
        '.eot',
      ],
      sensitiveDirectories: [
        'node_modules',
        '.git',
        '.env',
        'dist',
        'build',
        'coverage',
        'logs',
        'tmp',
        'temp',
      ],
      sensitiveFiles: [
        '.env',
        '.env.local',
        '.env.production',
        'package.json',
        'yarn.lock',
        'pnpm-lock.yaml',
        'webpack.config.js',
      ],
      allowHtmlFiles: false,
      allowDotFiles: false,
      ...options,
    };

    this.root = this.options.root!;
    this.protector = new ViteStaticFileProtector(this.options);
  }

  /**
   * Safely serves a static file
   */
  async serveFile(
    url: string,
    method: string = 'GET',
    headers: Record<string, string> = {}
  ): Promise<FileServeResult> {
    if (!this.options.enableProtection) {
      return {
        allowed: true,
        path: this.resolvePath(url),
      };
    }

    const request = { url, method, headers };
    const result = await this.protector.protect(request, 'safe-server');

    if (!result.allowed) {
      if (this.options.logAccess) {
        logger.warn('Static file access blocked', {
          url,
          reason: result.validation.issues[0],
          riskLevel: result.validation.riskLevel,
        });
      }

      return {
        allowed: false,
        error: 'Access denied',
        blockedReason: result.validation.issues[0],
      };
    }

    const resolvedPath = this.resolvePath(url);

    // Additional custom validation if provided
    if (this.options.customValidator && !this.options.customValidator(resolvedPath)) {
      return {
        allowed: false,
        error: 'Custom validation failed',
        blockedReason: 'Custom validator rejected the path',
      };
    }

    if (this.options.logAccess) {
      logger.info('Static file served', {
        url,
        path: resolvedPath,
        riskLevel: result.validation.riskLevel,
      });
    }

    return {
      allowed: true,
      path: resolvedPath,
    };
  }

  /**
   * Checks if a path is safe to serve
   */
  isPathSafe(path: string): boolean {
    return !ViteStaticPathValidator.shouldBlockPath(path, this.options);
  }

  /**
   * Validates a path and returns detailed result
   */
  validatePath(path: string) {
    return ViteStaticPathValidator.validatePath(path, this.options);
  }

  /**
   * Gets Vite configuration with security settings
   */
  getViteConfig(): any {
    return {
      server: {
        fs: {
          // Restrict file system access
          strict: true,
          allow: [this.root],
          deny: this.options.sensitiveDirectories,
        },
        middlewareMode: false,
      },
      build: {
        // Ensure sensitive files are not included in build
        rollupOptions: {
          external: this.options.sensitiveFiles,
        },
      },
    };
  }

  /**
   * Creates Express middleware for secure static file serving
   */
  createExpressMiddleware() {
    return this.protector.expressMiddleware();
  }

  /**
   * Creates Vite plugin for secure static file serving
   */
  createVitePlugin() {
    const self = this;

    return {
      name: 'vite-static-security',
      configureServer(server: any) {
        // Add middleware to Vite dev server
        server.middlewares.use(self.protector.middleware());
      },
      config() {
        return self.getViteConfig();
      },
    };
  }

  /**
   * Gets security statistics
   */
  getStats() {
    return this.protector.getStats();
  }

  /**
   * Updates server configuration
   */
  updateConfig(newOptions: Partial<ViteStaticServerOptions>) {
    this.options = { ...this.options, ...newOptions };
    this.protector.updateConfig(newOptions);
  }

  /**
   * Resolves a URL path to filesystem path
   */
  private resolvePath(url: string): string {
    // Remove query parameters and hash
    const cleanUrl = url.split('?')[0].split('#')[0];
    // Remove leading slash and decode URI
    const relativePath = decodeURIComponent(cleanUrl.replace(/^\/+/, ''));
    // Resolve to absolute path within root
    return require('path').resolve(this.root, relativePath);
  }
}

// Factory functions for convenience
export function createSafeViteStaticServer(
  options?: ViteStaticServerOptions
): SafeViteStaticServer {
  return new SafeViteStaticServer(options);
}

export function createSecureVitePlugin(options?: ViteStaticServerOptions) {
  const server = new SafeViteStaticServer(options);
  return server.createVitePlugin();
}

export function createSecureExpressMiddleware(options?: ViteStaticServerOptions) {
  const server = new SafeViteStaticServer(options);
  return server.createExpressMiddleware();
}
