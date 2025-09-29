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

/**
 * Safe Temp File Manager
 * Secure utilities for temporary file management
 */

import { TempFileProtector } from '../middleware/temp-file-protector';
import { TempFileConfig, TempFileValidator } from '../validators/temp-file.validator';

export interface SafeTempFileOptions {
  prefix?: string;
  suffix?: string;
  mode?: string | number;
  maxSize?: number;
  autoCleanup?: boolean;
  validateSymlinks?: boolean;
}

export class SafeTempFileManager {
  private protector: TempFileProtector;
  private config: TempFileConfig;
  private activeFiles: Set<string> = new Set();
  private activeDirs: Set<string> = new Set();

  constructor(config: Partial<TempFileConfig> = {}) {
    this.config = { ...TempFileValidator['DEFAULT_CONFIG'], ...config };
    this.protector = new TempFileProtector(this.config);
  }

  /**
   * Creates a safe temporary directory
   */
  async createTempDir(options: SafeTempFileOptions = {}): Promise<string> {
    const { prefix = 'safe-', autoCleanup = true } = options;

    try {
      const tempDir = await this.protector.createProtectedTempDir(prefix, 'safe-temp-manager');

      if (autoCleanup) {
        this.activeDirs.add(tempDir);

        // Set up cleanup on process exit
        this.setupCleanupHandlers(tempDir, 'directory');
      }

      logger.info('Created safe temp directory', { path: tempDir, prefix });
      return tempDir;
    } catch (error) {
      logger.error('Failed to create safe temp directory', { error, prefix });
      throw error;
    }
  }

  /**
   * Creates a safe temporary file
   */
  async createTempFile(options: SafeTempFileOptions = {}): Promise<string> {
    const { prefix = 'safe-', suffix = '', mode, autoCleanup = true } = options;

    try {
      const tempFile = await this.protector.createProtectedTempFile(
        prefix,
        suffix,
        'safe-temp-manager'
      );

      // Set file mode if specified
      if (mode !== undefined) {
        require('fs').chmodSync(tempFile, mode);
      }

      if (autoCleanup) {
        this.activeFiles.add(tempFile);

        // Set up cleanup on process exit
        this.setupCleanupHandlers(tempFile, 'file');
      }

      logger.info('Created safe temp file', { path: tempFile, prefix, suffix });
      return tempFile;
    } catch (error) {
      logger.error('Failed to create safe temp file', { error, prefix, suffix });
      throw error;
    }
  }

  /**
   * Safely writes to a temporary file
   */
  async writeTempFile(
    filePath: string,
    data: string | Buffer,
    options: SafeTempFileOptions = {}
  ): Promise<void> {
    const { maxSize = this.config.maxTempFileSize } = options;

    // Validate the file path
    if (!this.protector.protect('writeTempFile', filePath, 'safe-temp-manager')) {
      throw new Error(`Temp file write blocked: ${filePath}`);
    }

    // Check data size
    const dataSize = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data, 'utf8');
    if (dataSize > maxSize) {
      throw new Error(`Data size (${dataSize}) exceeds maximum allowed size (${maxSize})`);
    }

    try {
      require('fs').writeFileSync(filePath, data);
      logger.info('Successfully wrote to temp file', { path: filePath, size: dataSize });
    } catch (error) {
      logger.error('Failed to write temp file', { path: filePath, error });
      throw error;
    }
  }

  /**
   * Safely reads from a temporary file
   */
  async readTempFile(filePath: string): Promise<Buffer> {
    // Validate the file path
    if (!this.protector.protect('readTempFile', filePath, 'safe-temp-manager')) {
      throw new Error(`Temp file read blocked: ${filePath}`);
    }

    try {
      const data = require('fs').readFileSync(filePath);
      logger.info('Successfully read from temp file', { path: filePath, size: data.length });
      return data;
    } catch (error) {
      logger.error('Failed to read temp file', { path: filePath, error });
      throw error;
    }
  }

  /**
   * Safely removes a temporary file or directory
   */
  async removeTempPath(filePath: string): Promise<void> {
    try {
      const stats = require('fs').statSync(filePath);

      if (stats.isDirectory()) {
        require('fs').rmdirSync(filePath);
        this.activeDirs.delete(filePath);
        logger.info('Removed temp directory', { path: filePath });
      } else {
        require('fs').unlinkSync(filePath);
        this.activeFiles.delete(filePath);
        logger.info('Removed temp file', { path: filePath });
      }
    } catch (error) {
      logger.error('Failed to remove temp path', { path: filePath, error });
      throw error;
    }
  }

  /**
   * Cleans up all active temporary files and directories
   */
  async cleanup(): Promise<void> {
    const errors: Error[] = [];

    // Clean up files
    for (const filePath of this.activeFiles) {
      try {
        await this.removeTempPath(filePath);
      } catch (error) {
        errors.push(error as Error);
      }
    }

    // Clean up directories
    for (const dirPath of this.activeDirs) {
      try {
        await this.removeTempPath(dirPath);
      } catch (error) {
        errors.push(error as Error);
      }
    }

    this.activeFiles.clear();
    this.activeDirs.clear();

    if (errors.length > 0) {
      logger.warn('Some temp files failed to cleanup', { errorCount: errors.length });
      throw new Error(`Cleanup failed for ${errors.length} items`);
    }

    logger.info('Temp file cleanup completed');
  }

  /**
   * Gets statistics about temp file operations
   */
  getStats() {
    return this.protector.getStats();
  }

  /**
   * Sets up cleanup handlers for process exit
   */
  private setupCleanupHandlers(path: string, type: 'file' | 'directory'): void {
    const cleanup = () => {
      try {
        if (type === 'file') {
          require('fs').unlinkSync(path);
        } else {
          require('fs').rmdirSync(path);
        }
      } catch (error) {
        // Ignore cleanup errors during process exit
      }
    };

    process.on('exit', cleanup);
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('uncaughtException', cleanup);
  }
}
