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

import * as fs from 'fs';
import * as path from 'path';

/**
 * Temp File Protector
 * Middleware for protecting temporary file operations
 */

import { TempFileConfig, TempFileValidator } from '../validators/temp-file.validator';

export interface TempFileProtectionStats {
  totalOperations: number;
  blockedOperations: number;
  symlinkAttempts: number;
  invalidPathAttempts: number;
  lastBlockedOperation?: {
    path: string;
    reason: string;
    timestamp: Date;
  };
}

export class TempFileProtector {
  private config: TempFileConfig;
  private stats: TempFileProtectionStats;

  constructor(config: Partial<TempFileConfig> = {}) {
    // Merge allowedTempDirs instead of replacing
    const defaultConfig = TempFileValidator['DEFAULT_CONFIG'];
    const mergedAllowedTempDirs = config.allowedTempDirs
      ? [...new Set([...defaultConfig.allowedTempDirs, ...config.allowedTempDirs])]
      : defaultConfig.allowedTempDirs;

    this.config = { ...defaultConfig, ...config, allowedTempDirs: mergedAllowedTempDirs };
    this.stats = {
      totalOperations: 0,
      blockedOperations: 0,
      symlinkAttempts: 0,
      invalidPathAttempts: 0,
    };
  }

  /**
   * Protects a temporary file operation
   */
  protect(operation: string, filePath: string, context: string = 'temp-file'): boolean {
    this.stats.totalOperations++;

    const validation = TempFileValidator.validateTempPath(filePath, this.config);

    if (!validation.isValid) {
      this.stats.blockedOperations++;
      this.stats.invalidPathAttempts++;

      if (validation.isSymlink) {
        this.stats.symlinkAttempts++;
      }

      this.stats.lastBlockedOperation = {
        path: filePath,
        reason: validation.issues.join(', '),
        timestamp: new Date(),
      };

      logger.warn(`Blocked temp file operation in ${context}`, {
        operation,
        path: filePath,
        validation,
        userAgent: this.getUserAgent(),
        pid: process.pid,
      });

      return false;
    }

    logger.info(`Allowed temp file operation in ${context}`, {
      operation,
      path: filePath,
      normalizedPath: validation.normalizedPath,
    });

    return true;
  }

  /**
   * Creates a protected temporary directory
   */
  async createProtectedTempDir(
    prefix: string = 'app-',
    context: string = 'temp-file'
  ): Promise<string> {
    const os = require('os');
    const crypto = require('crypto');

    // Generate secure random directory name
    const randomBytes = crypto.randomBytes(8).toString('hex');
    const dirName = `${prefix}${randomBytes}`;
    const tempDir = path.join(os.tmpdir(), dirName);

    try {
      // Create directory using secure method
      fs.mkdirSync(tempDir, { mode: 0o700 });

      // Validate the created directory
      if (!this.protect('createTempDir', tempDir, context)) {
        // Clean up if validation fails
        try {
          fs.rmdirSync(tempDir);
        } catch (cleanupError) {
          logger.error('Failed to cleanup invalid temp directory', {
            path: tempDir,
            error: cleanupError,
          });
        }
        throw new Error('Created temp directory failed security validation');
      }

      return tempDir;
    } catch (error) {
      logger.error('Failed to create protected temp directory', { error, prefix });
      throw error;
    }
  }

  /**
   * Creates a protected temporary file
   */
  async createProtectedTempFile(
    prefix: string = 'app-',
    suffix: string = '',
    context: string = 'temp-file'
  ): Promise<string> {
    const crypto = require('crypto');

    // Create temp directory first
    const tempDir = await this.createProtectedTempDir(prefix, context);

    // Generate secure random filename
    const randomBytes = crypto.randomBytes(8).toString('hex');
    const fileName = `${prefix}${randomBytes}${suffix}`;
    const filePath = path.join(tempDir, fileName);

    try {
      // Create empty file
      fs.writeFileSync(filePath, '');

      // Validate the created file
      if (!this.protect('createTempFile', filePath, context)) {
        // Clean up if validation fails
        try {
          fs.unlinkSync(filePath);
          fs.rmdirSync(tempDir);
        } catch (cleanupError) {
          logger.error('Failed to cleanup invalid temp file', {
            path: filePath,
            error: cleanupError,
          });
        }
        throw new Error('Created temp file failed security validation');
      }

      return filePath;
    } catch (error) {
      logger.error('Failed to create protected temp file', { error, tempDir, fileName });
      throw error;
    }
  }

  /**
   * Gets protection statistics
   */
  getStats(): TempFileProtectionStats {
    return { ...this.stats };
  }

  /**
   * Resets protection statistics
   */
  resetStats(): void {
    this.stats = {
      totalOperations: 0,
      blockedOperations: 0,
      symlinkAttempts: 0,
      invalidPathAttempts: 0,
    };
  }

  /**
   * Gets user agent for logging
   */
  private getUserAgent(): string | undefined {
    // In a real application, this would come from request headers
    // For now, return undefined
    return undefined;
  }
}
