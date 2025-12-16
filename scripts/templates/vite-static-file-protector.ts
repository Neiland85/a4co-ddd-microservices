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

import {
  PathValidationResult,
  StaticFileConfig,
  ViteStaticPathValidator,
} from '../validators/vite-static-path.validator';

/**
 * Vite Static File Protector Middleware
 * Provides middleware protection for Vite static file serving
 */

export interface ViteStaticFileRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
}

export interface ViteStaticFileResponse {
  status: number;
  headers: Record<string, string>;
  body?: string;
}

export interface ProtectionStats {
  totalRequests: number;
  blockedRequests: number;
  allowedRequests: number;
  sensitiveFileBlocks: number;
  traversalAttempts: number;
  lastBlockedPath?: string;
  lastBlockedTime?: number;
}

export class ViteStaticFileProtector {
  private config: StaticFileConfig;
  private stats: ProtectionStats = {
    totalRequests: 0,
    blockedRequests: 0,
    allowedRequests: 0,
    sensitiveFileBlocks: 0,
    traversalAttempts: 0,
  };

  constructor(config: Partial<StaticFileConfig> = {}) {
    this.config = {
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
      allowDotFiles: false,
      ...config,
    };
  }

  /**
   * Protects static file serving by validating requests
   */
  async protect(
    request: ViteStaticFileRequest,
    context: string = 'vite-static',
  ): Promise<{
    allowed: boolean;
    response?: ViteStaticFileResponse;
    validation: PathValidationResult;
  }> {
    this.stats.totalRequests++;

    // Only protect GET requests for static files
    if (request.method !== 'GET') {
      this.stats.allowedRequests++;
      return {
        allowed: true,
        validation: {
          isValid: true,
          sanitizedPath: request.url,
        },
      };
    }

    // Extract path from URL
    const path = this.extractPathFromUrl(request.url);
    const validator = new ViteStaticPathValidator(this.config);
    const validation = validator.validate(path);

    if (!validation.isValid) {
      this.stats.blockedRequests++;
      this.stats.lastBlockedPath = path;
      this.stats.lastBlockedTime = Date.now();

      if (
        validation.blockedReason === 'sensitive_file' ||
        validation.blockedReason === 'sensitive_directory'
      ) {
        this.stats.sensitiveFileBlocks++;
      }

      if (validation.blockedReason === 'path_traversal') {
        this.stats.traversalAttempts++;
      }

      logger.warn(`Blocked static file access attempt in ${context}`, {
        path,
        error: validation.error,
        blockedReason: validation.blockedReason,
        userAgent: request.headers['user-agent'],
        referer: request.headers.referer,
      });

      return {
        allowed: false,
        response: {
          status: 403,
          headers: {
            'Content-Type': 'text/plain',
            'X-Blocked-Reason': validation.error || 'Access denied',
          },
          body: 'Access denied',
        },
        validation,
      };
    }

    this.stats.allowedRequests++;

    return {
      allowed: true,
      validation,
    };
  }

  /**
   * Middleware function for Vite
   */
  middleware() {
    return async (req: ViteStaticFileRequest, res: any, next: () => void) => {
      const result = await this.protect(req, 'vite-middleware');

      if (!result.allowed) {
        res.statusCode = result.response!.status;
        Object.entries(result.response!.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        res.end(result.response!.body);
        return;
      }

      next();
    };
  }

  /**
   * Express.js middleware
   */
  expressMiddleware() {
    return async (req: any, res: any, next: () => void) => {
      const request: ViteStaticFileRequest = {
        url: req.url,
        method: req.method,
        headers: req.headers,
      };

      const result = await this.protect(request, 'express-middleware');

      if (!result.allowed) {
        res.status(result.response!.status);
        Object.entries(result.response!.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        res.send(result.response!.body);
        return;
      }

      next();
    };
  }

  /**
   * Gets current protection statistics
   */
  getStats(): ProtectionStats {
    return { ...this.stats };
  }

  /**
   * Resets statistics
   */
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      blockedRequests: 0,
      allowedRequests: 0,
      sensitiveFileBlocks: 0,
      traversalAttempts: 0,
    };
  }

  /**
   * Updates configuration
   */
  updateConfig(newConfig: Partial<StaticFileConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Extracts path from URL
   */
  private extractPathFromUrl(url: string): string {
    try {
      // Remove query parameters and hash
      const cleanUrl = url.split('?')[0].split('#')[0];
      // Remove leading slash
      return cleanUrl.replace(/^\/+/, '');
    } catch {
      return url;
    }
  }
}
