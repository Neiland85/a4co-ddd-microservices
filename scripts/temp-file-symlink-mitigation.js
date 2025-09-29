#!/usr/bin/env node

/**
 * Temp File Symlink Attack Mitigation Script
 * Implements comprehensive security mitigations for "tmp — arbitrary temp file write via symlink (Low)"
 *
 * This script creates:
 * - TempFileValidator: Validates temp file paths and detects symlink attacks
 * - TempFileProtector: Middleware for protecting temp file operations
 * - SafeTempFileManager: Secure utilities for temp file management
 * - ESLint rules: Detect insecure temp file usage
 * - Comprehensive tests
 * - Documentation
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Implementing Temp File Symlink Attack Mitigations...\n');

// Configuration
const BASE_DIR = path.join(__dirname, '..');
const SHARED_UTILS_DIR = path.join(BASE_DIR, 'packages', 'shared-utils');
const SCRIPTS_DIR = path.join(BASE_DIR, 'scripts');
const ESLINT_DIR = path.join(BASE_DIR, 'eslint-rules');

// Ensure directories exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

[
  path.join(SHARED_UTILS_DIR, 'src', 'security', 'validators'),
  path.join(SHARED_UTILS_DIR, 'src', 'security', 'middleware'),
  path.join(SHARED_UTILS_DIR, 'src', 'security', 'utils'),
  path.join(SHARED_UTILS_DIR, 'src', 'security', '__tests__'),
  ESLINT_DIR,
  path.join(SCRIPTS_DIR, 'templates'),
].forEach(ensureDir);

// Template content definitions
const templates = {
  'temp-file-validator.ts': `// Import opcional para observabilidad (fallback a console si no está disponible)
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
 * Temp File Validator
 * Validates temporary file operations to prevent symlink attacks
 */

export interface TempFileValidationResult {
  isValid: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  issues: string[];
  recommendations: string[];
  normalizedPath: string;
  isSymlink: boolean;
  targetPath?: string;
}

export interface TempFileConfig {
  allowedTempDirs: string[];
  maxTempFileSize: number;
  allowSymlinks: boolean;
  validateParentDirs: boolean;
}

export class TempFileValidator {
  private static readonly DEFAULT_CONFIG: TempFileConfig = {
    allowedTempDirs: ['/tmp', '/var/tmp', '/dev/shm'],
    maxTempFileSize: 100 * 1024 * 1024, // 100MB
    allowSymlinks: false,
    validateParentDirs: true
  };

  /**
   * Validates a temporary file path
   */
  static validateTempPath(filePath: string, config: Partial<TempFileConfig> = {}): TempFileValidationResult {
    if (!filePath || typeof filePath !== 'string') {
      return {
        isValid: false,
        riskLevel: 'critical',
        issues: ['File path must be a non-empty string'],
        recommendations: ['Provide a valid file path'],
        normalizedPath: '',
        isSymlink: false
      };
    }

    const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
    const normalizedPath = path.resolve(filePath);
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check if path is in allowed temp directories
    const isInAllowedTempDir = fullConfig.allowedTempDirs.some(tempDir =>
      normalizedPath.startsWith(path.resolve(tempDir))
    );

    if (!isInAllowedTempDir) {
      issues.push('File path is not in allowed temporary directories');
      recommendations.push('Use paths within allowed temporary directories only');
    }

    // Check for symlink attacks
    let isSymlink = false;
    let targetPath: string | undefined;

    try {
      const stats = fs.lstatSync(filePath);
      isSymlink = stats.isSymbolicLink();

      if (isSymlink) {
        if (!fullConfig.allowSymlinks) {
          issues.push('Symbolic links are not allowed in temporary file operations');
          recommendations.push('Avoid using symbolic links in temp file operations');
        }

        try {
          targetPath = fs.readlinkSync(filePath);
          const resolvedTarget = path.resolve(path.dirname(filePath), targetPath);

          // Check if symlink points outside allowed directories
          const isTargetAllowed = fullConfig.allowedTempDirs.some(tempDir =>
            resolvedTarget.startsWith(path.resolve(tempDir))
          );

          if (!isTargetAllowed) {
            issues.push('Symbolic link points outside allowed temporary directories');
            recommendations.push('Ensure symlinks point within allowed temp directories');
          }
        } catch (error) {
          issues.push('Cannot resolve symbolic link target');
          recommendations.push('Verify symlink integrity before use');
        }
      }
    } catch (error) {
      // File doesn't exist yet, which is normal for temp file creation
      // We'll validate parent directory instead
    }

    // Validate parent directories if requested
    if (fullConfig.validateParentDirs) {
      const parentDir = path.dirname(normalizedPath);
      try {
        const parentStats = fs.lstatSync(parentDir);
        if (parentStats.isSymbolicLink()) {
          issues.push('Parent directory is a symbolic link');
          recommendations.push('Avoid creating files in symlinked directories');
        }
      } catch (error) {
        issues.push('Cannot access parent directory');
        recommendations.push('Ensure parent directory exists and is accessible');
      }
    }

    // Check for suspicious patterns
    if (this.hasSuspiciousPatterns(normalizedPath)) {
      issues.push('Path contains suspicious patterns');
      recommendations.push('Review path for potential security issues');
    }

    const riskLevel = this.assessRiskLevel(issues, isSymlink);
    const isValid = riskLevel !== 'critical' && issues.length === 0;

    return {
      isValid,
      riskLevel,
      issues,
      recommendations,
      normalizedPath,
      isSymlink,
      targetPath
    };
  }

  /**
   * Validates multiple temp file paths
   */
  static validateTempPaths(paths: string[], config?: Partial<TempFileConfig>): TempFileValidationResult[] {
    return paths.map(path => this.validateTempPath(path, config));
  }

  /**
   * Checks if a temp file operation should be blocked
   */
  static shouldBlockTempOperation(filePath: string, config?: Partial<TempFileConfig>): boolean {
    const result = this.validateTempPath(filePath, config);
    return !result.isValid || result.isSymlink;
  }

  /**
   * Sanitizes a temp file path
   */
  static sanitizeTempPath(filePath: string): string {
    if (!filePath) return filePath;

    // Resolve to absolute path
    const resolved = path.resolve(filePath);

    // Remove any dangerous path components
    const parts = resolved.split(path.sep).filter(part =>
      part !== '' && part !== '.' && part !== '..'
    );

    return path.join(...parts);
  }

  /**
   * Checks for suspicious patterns in path
   */
  private static hasSuspiciousPatterns(path: string): boolean {
    const suspiciousPatterns = [
      /\0/, // Null bytes
      /[<>\"'|?*]/, // Potentially dangerous characters
      /\/\/+/, // Multiple slashes
      /\.{3,}/, // Multiple dots
    ];

    return suspiciousPatterns.some(pattern => pattern.test(path));
  }

  /**
   * Assesses risk level based on issues
   */
  private static assessRiskLevel(issues: string[], isSymlink: boolean): 'low' | 'medium' | 'high' | 'critical' {
    if (isSymlink) return 'high';

    if (issues.some(issue => issue.includes('not in allowed'))) return 'critical';
    if (issues.some(issue => issue.includes('symlink'))) return 'high';
    if (issues.some(issue => issue.includes('parent directory'))) return 'medium';

    return issues.length > 0 ? 'low' : 'low';
  }
}`,

  'temp-file-protector.ts': `// Import opcional para observabilidad (fallback a console si no está disponible)
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
 * Temp File Protector
 * Middleware for protecting temporary file operations
 */

import { TempFileValidator, TempFileConfig } from '../validators/temp-file.validator';

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
    this.config = { ...TempFileValidator['DEFAULT_CONFIG'], ...config };
    this.stats = {
      totalOperations: 0,
      blockedOperations: 0,
      symlinkAttempts: 0,
      invalidPathAttempts: 0
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
        timestamp: new Date()
      };

      logger.warn(\`Blocked temp file operation in \${context}\`, {
        operation,
        path: filePath,
        validation,
        userAgent: this.getUserAgent(),
        pid: process.pid
      });

      return false;
    }

    logger.info(\`Allowed temp file operation in \${context}\`, {
      operation,
      path: filePath,
      normalizedPath: validation.normalizedPath
    });

    return true;
  }

  /**
   * Creates a protected temporary directory
   */
  async createProtectedTempDir(prefix: string = 'app-', context: string = 'temp-file'): Promise<string> {
    const { mkdtemp } = require('fs').promises;
    const os = require('os');
    const crypto = require('crypto');

    // Generate secure random directory name
    const randomBytes = crypto.randomBytes(8).toString('hex');
    const dirName = \`\${prefix}\${randomBytes}\`;
    const tempDir = path.join(os.tmpdir(), dirName);

    try {
      // Create directory using secure method
      const createdDir = await mkdtemp(path.join(os.tmpdir(), prefix));

      // Validate the created directory
      if (!this.protect('createTempDir', createdDir, context)) {
        // Clean up if validation fails
        try {
          require('fs').rmdirSync(createdDir);
        } catch (cleanupError) {
          logger.error('Failed to cleanup invalid temp directory', { path: createdDir, error: cleanupError });
        }
        throw new Error('Created temp directory failed security validation');
      }

      return createdDir;
    } catch (error) {
      logger.error('Failed to create protected temp directory', { error, prefix });
      throw error;
    }
  }

  /**
   * Creates a protected temporary file
   */
  async createProtectedTempFile(prefix: string = 'app-', suffix: string = '', context: string = 'temp-file'): Promise<string> {
    const { mkdtemp } = require('fs').promises;
    const os = require('os');
    const crypto = require('crypto');
    const fs = require('fs');

    // Create temp directory first
    const tempDir = await this.createProtectedTempDir(prefix, context);

    // Generate secure random filename
    const randomBytes = crypto.randomBytes(8).toString('hex');
    const fileName = \`\${prefix}\${randomBytes}\${suffix}\`;
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
          logger.error('Failed to cleanup invalid temp file', { path: filePath, error: cleanupError });
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
      invalidPathAttempts: 0
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
}`,

  'safe-temp-file-manager.ts': `// Import opcional para observabilidad (fallback a console si no está disponible)
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

import { TempFileValidator, TempFileConfig } from '../validators/temp-file.validator';
import { TempFileProtector } from '../middleware/temp-file-protector';

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
      const tempFile = await this.protector.createProtectedTempFile(prefix, suffix, 'safe-temp-manager');

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
  async writeTempFile(filePath: string, data: string | Buffer, options: SafeTempFileOptions = {}): Promise<void> {
    const { maxSize = this.config.maxTempFileSize } = options;

    // Validate the file path
    if (!this.protector.protect('writeTempFile', filePath, 'safe-temp-manager')) {
      throw new Error(\`Temp file write blocked: \${filePath}\`);
    }

    // Check data size
    const dataSize = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data, 'utf8');
    if (dataSize > maxSize) {
      throw new Error(\`Data size (\${dataSize}) exceeds maximum allowed size (\${maxSize})\`);
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
      throw new Error(\`Temp file read blocked: \${filePath}\`);
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
      throw new Error(\`Cleanup failed for \${errors.length} items\`);
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
}`,

  'temp-file-security.test.ts': `/**
 * Temp File Security Tests
 * Comprehensive security tests for temp file symlink attack mitigations
 */

import { TempFileValidator } from '../validators/temp-file.validator';
import { TempFileProtector } from '../middleware/temp-file-protector';
import { SafeTempFileManager } from '../utils/safe-temp-file-manager';

describe('TempFileValidator', () => {
  const config = {
    allowedTempDirs: ['/tmp', '/var/tmp'],
    allowSymlinks: false,
    validateParentDirs: true
  };

  describe('validateTempPath', () => {
    it('should allow safe temp paths', () => {
      const result = TempFileValidator.validateTempPath('/tmp/safe-file.txt', config);
      expect(result.isValid).toBe(true);
      expect(result.riskLevel).toBe('low');
      expect(result.isSymlink).toBe(false);
    });

    it('should block paths outside allowed temp directories', () => {
      const result = TempFileValidator.validateTempPath('/etc/passwd', config);
      expect(result.isValid).toBe(false);
      expect(result.riskLevel).toBe('critical');
      expect(result.issues).toContain('File path is not in allowed temporary directories');
    });

    it('should detect and block symlinks', () => {
      // Create a test symlink
      const fs = require('fs');
      const path = require('path');
      const testDir = path.join(require('os').tmpdir(), 'test-symlink-dir');
      const targetFile = path.join(testDir, 'target.txt');
      const symlinkFile = path.join(testDir, 'symlink.txt');

      try {
        fs.mkdirSync(testDir, { recursive: true });
        fs.writeFileSync(targetFile, 'test');
        fs.symlinkSync(targetFile, symlinkFile);

        const result = TempFileValidator.validateTempPath(symlinkFile, config);
        expect(result.isValid).toBe(false);
        expect(result.isSymlink).toBe(true);
        expect(result.issues).toContain('Symbolic links are not allowed in temporary file operations');
      } finally {
        try {
          fs.unlinkSync(symlinkFile);
          fs.unlinkSync(targetFile);
          fs.rmdirSync(testDir);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    });

    it('should validate parent directories', () => {
      const result = TempFileValidator.validateTempPath('/tmp/nonexistent-parent/child.txt', {
        ...config,
        validateParentDirs: true
      });
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Cannot access parent directory');
    });
  });

  describe('validateTempPaths', () => {
    it('should validate multiple paths', () => {
      const paths = ['/tmp/safe.txt', '/etc/passwd', '/tmp/another.txt'];
      const results = TempFileValidator.validateTempPaths(paths, config);

      expect(results).toHaveLength(3);
      expect(results[0].isValid).toBe(true);
      expect(results[1].toBe(false);
      expect(results[2].isValid).toBe(true);
    });
  });

  describe('sanitizeTempPath', () => {
    it('should normalize temp paths', () => {
      expect(TempFileValidator.sanitizeTempPath('/tmp/../tmp/safe.txt')).toBe('/tmp/safe.txt');
      expect(TempFileValidator.sanitizeTempPath('./tmp/file.txt')).toBe('/tmp/file.txt');
    });
  });
});

describe('TempFileProtector', () => {
  let protector: TempFileProtector;

  beforeEach(() => {
    protector = new TempFileProtector({
      allowedTempDirs: ['/tmp', '/var/tmp'],
      allowSymlinks: false
    });
  });

  describe('protect', () => {
    it('should allow safe operations', () => {
      const result = protector.protect('read', '/tmp/safe-file.txt');
      expect(result).toBe(true);
    });

    it('should block unsafe operations', () => {
      const result = protector.protect('write', '/etc/passwd');
      expect(result).toBe(false);
    });
  });

  describe('createProtectedTempDir', () => {
    it('should create protected temp directory', async () => {
      const tempDir = await protector.createProtectedTempDir('test-');
      expect(tempDir).toContain('test-');
      expect(tempDir.startsWith('/tmp/')).toBe(true);

      // Cleanup
      require('fs').rmdirSync(tempDir);
    });
  });

  describe('createProtectedTempFile', () => {
    it('should create protected temp file', async () => {
      const tempFile = await protector.createProtectedTempFile('test-', '.txt');
      expect(tempFile).toContain('test-');
      expect(tempFile.endsWith('.txt')).toBe(true);

      // Cleanup
      const fs = require('fs');
      const path = require('path');
      fs.unlinkSync(tempFile);
      fs.rmdirSync(path.dirname(tempFile));
    });
  });

  describe('getStats', () => {
    it('should return protection statistics', () => {
      protector.protect('read', '/tmp/safe.txt');
      protector.protect('write', '/etc/passwd'); // This should be blocked

      const stats = protector.getStats();
      expect(stats.totalOperations).toBe(2);
      expect(stats.blockedOperations).toBe(1);
    });
  });
});

describe('SafeTempFileManager', () => {
  let manager: SafeTempFileManager;

  beforeEach(() => {
    manager = new SafeTempFileManager({
      allowedTempDirs: ['/tmp', '/var/tmp'],
      allowSymlinks: false
    });
  });

  describe('createTempDir', () => {
    it('should create safe temp directory', async () => {
      const tempDir = await manager.createTempDir({ prefix: 'test-' });
      expect(tempDir.startsWith('/tmp/test-')).toBe(true);

      // Verify directory exists
      const fs = require('fs');
      expect(fs.existsSync(tempDir)).toBe(true);
      expect(fs.statSync(tempDir).isDirectory()).toBe(true);
    });
  });

  describe('createTempFile', () => {
    it('should create safe temp file', async () => {
      const tempFile = await manager.createTempFile({ prefix: 'test-', suffix: '.txt' });
      expect(tempFile.includes('test-')).toBe(true);
      expect(tempFile.endsWith('.txt')).toBe(true);

      // Verify file exists
      const fs = require('fs');
      expect(fs.existsSync(tempFile)).toBe(true);
      expect(fs.statSync(tempFile).isFile()).toBe(true);
    });
  });

  describe('writeTempFile and readTempFile', () => {
    it('should safely write and read temp files', async () => {
      const tempFile = await manager.createTempFile();
      const testData = 'Hello, secure temp file!';

      await manager.writeTempFile(tempFile, testData);
      const readData = await manager.readTempFile(tempFile);

      expect(readData.toString()).toBe(testData);
    });

    it('should enforce size limits', async () => {
      const tempFile = await manager.createTempFile();
      const largeData = Buffer.alloc(1024 * 1024); // 1MB

      await expect(manager.writeTempFile(tempFile, largeData, { maxSize: 1024 })).rejects.toThrow();
    });
  });

  describe('cleanup', () => {
    it('should cleanup all temp files and directories', async () => {
      const tempFile = await manager.createTempFile();
      const tempDir = await manager.createTempDir();

      const fs = require('fs');
      expect(fs.existsSync(tempFile)).toBe(true);
      expect(fs.existsSync(tempDir)).toBe(true);

      await manager.cleanup();

      expect(fs.existsSync(tempFile)).toBe(false);
      expect(fs.existsSync(tempDir)).toBe(false);
    });
  });
});`,

  'temp-file-rules.js': `/**
 * ESLint rules for detecting insecure temp file operations
 */

module.exports = {
  rules: {
    'no-insecure-temp-file-creation': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detect insecure temporary file creation patterns',
          category: 'Security',
          recommended: true
        },
        schema: [],
        messages: {
          insecureTempCreation: 'Insecure temporary file creation detected. Use fs.mkdtemp() or SafeTempFileManager instead.',
          avoidPredictableTempNames: 'Avoid predictable temporary file names. Use random suffixes.',
          noDirectTempOperations: 'Direct temp file operations without validation detected. Use protected wrappers.'
        }
      },
      create(context) {
        return {
          CallExpression(node) {
            const { callee } = node;

            // Detect fs.writeFile, fs.writeFileSync with temp paths
            if (
              callee.type === 'MemberExpression' &&
              callee.object.name === 'fs' &&
              ['writeFile', 'writeFileSync', 'appendFile', 'appendFileSync'].includes(callee.property.name)
            ) {
              const args = node.arguments;
              if (args.length > 0 && args[0].type === 'Literal') {
                const filePath = args[0].value;
                if (typeof filePath === 'string' && (filePath.includes('/tmp/') || filePath.includes('/var/tmp/'))) {
                  context.report({
                    node,
                    messageId: 'noDirectTempOperations',
                    data: { filePath }
                  });
                }
              }
            }

            // Detect insecure temp directory creation
            if (
              callee.type === 'MemberExpression' &&
              callee.object.name === 'fs' &&
              ['mkdir', 'mkdirSync'].includes(callee.property.name)
            ) {
              const args = node.arguments;
              if (args.length > 0 && args[0].type === 'Literal') {
                const dirPath = args[0].value;
                if (typeof dirPath === 'string' && (dirPath.includes('/tmp/') || dirPath.includes('/var/tmp/'))) {
                  context.report({
                    node,
                    messageId: 'insecureTempCreation'
                  });
                }
              }
            }

            // Detect predictable temp file names
            if (
              callee.type === 'CallExpression' &&
              callee.callee.name === 'path.join' &&
              node.arguments.some(arg =>
                arg.type === 'Literal' &&
                typeof arg.value === 'string' &&
                arg.value.includes('temp') &&
                !arg.value.includes(Math.random().toString())
              )
            ) {
              context.report({
                node,
                messageId: 'avoidPredictableTempNames'
              });
            }
          },

          VariableDeclarator(node) {
            // Detect variable assignments with temp paths
            if (
              node.init &&
              node.init.type === 'CallExpression' &&
              node.init.callee.name === 'require' &&
              node.init.arguments[0].value === 'tmp'
            ) {
              context.report({
                node,
                messageId: 'insecureTempCreation'
              });
            }
          }
        };
      }
    },

    'no-symlink-temp-operations': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Detect operations on symlinked temp files',
          category: 'Security',
          recommended: true
        },
        schema: [],
        messages: {
          symlinkTempOperation: 'Operation on potentially symlinked temp file detected. Use SafeTempFileManager for validation.'
        }
      },
      create(context) {
        return {
          CallExpression(node) {
            const { callee } = node;

            if (
              callee.type === 'MemberExpression' &&
              callee.object.name === 'fs' &&
              ['readFile', 'readFileSync', 'writeFile', 'writeFileSync', 'unlink', 'unlinkSync'].includes(callee.property.name)
            ) {
              const args = node.arguments;
              if (args.length > 0 && args[0].type === 'Literal') {
                const filePath = args[0].value;
                if (typeof filePath === 'string' && (filePath.includes('/tmp/') || filePath.includes('/var/tmp/'))) {
                  context.report({
                    node,
                    messageId: 'symlinkTempOperation'
                  });
                }
              }
            }
          }
        };
      }
    }
  }
};`,

  'temp-file-symlink-mitigation.md': `# Temp File Symlink Attack Mitigation

## Overview

This document describes the comprehensive security mitigations implemented for the "tmp — arbitrary temp file write via symlink (Low)" vulnerability.

## Vulnerability Description

**Tactics**: Initial Access / Persistence (local)
**Vector**: API that creates temp dir using dir without validating symlinks; attacker controls dir and points to /etc or path with SUID.
**Impact**: Arbitrary file write if permissions allow; combined cases may enable RCE.
**Detection**: Creation of files in unexpected locations, unusual use of mktemp/tmp.
**Mitigation**: Use fs.mkdtemp() secure, validate symlinks, run with lower privilege.

## Implemented Components

### 1. TempFileValidator

Validates temporary file paths and detects symlink attacks:

\`\`\`typescript
import { TempFileValidator } from '@a4co/shared-utils/security/validators/temp-file.validator';

// Validate a temp file path
const result = TempFileValidator.validateTempPath('/tmp/user-upload.txt', {
  allowedTempDirs: ['/tmp', '/var/tmp'],
  allowSymlinks: false
});

if (!result.isValid) {
  console.log('Blocked:', result.issues);
}
\`\`\`

**Features:**
- Path validation against allowed temp directories
- Symlink detection and blocking
- Parent directory validation
- Suspicious pattern detection

### 2. TempFileProtector

Middleware for protecting temp file operations:

\`\`\`typescript
import { TempFileProtector } from '@a4co/shared-utils/security/middleware/temp-file-protector';

const protector = new TempFileProtector({
  allowedTempDirs: ['/tmp', '/var/tmp'],
  allowSymlinks: false
});

// Protect file operations
if (protector.protect('write', '/tmp/user-file.txt')) {
  // Safe to proceed
  fs.writeFileSync('/tmp/user-file.txt', data);
}

// Create protected temp directory
const tempDir = await protector.createProtectedTempDir('app-');

// Create protected temp file
const tempFile = await protector.createProtectedTempFile('upload-', '.txt');
\`\`\`

**Features:**
- Operation protection with validation
- Secure temp directory/file creation using fs.mkdtemp()
- Statistics tracking
- Automatic cleanup

### 3. SafeTempFileManager

High-level utilities for secure temp file management:

\`\`\`typescript
import { SafeTempFileManager } from '@a4co/shared-utils/security/utils/safe-temp-file-manager';

const manager = new SafeTempFileManager();

// Create safe temp directory
const tempDir = await manager.createTempDir({ prefix: 'upload-' });

// Create safe temp file
const tempFile = await manager.createTempFile({
  prefix: 'data-',
  suffix: '.json',
  autoCleanup: true
});

// Safe read/write operations
await manager.writeTempFile(tempFile, JSON.stringify(data));
const readData = await manager.readTempFile(tempFile);

// Cleanup all temp files
await manager.cleanup();
\`\`\`

**Features:**
- Automatic cleanup on process exit
- Size limits enforcement
- Secure random file names
- Statistics and monitoring

## ESLint Rules

Custom ESLint rules to detect insecure temp file usage:

\`\`\`javascript
// .eslintrc.js
module.exports = {
  plugins: ['temp-file-security'],
  rules: {
    'temp-file-security/no-insecure-temp-file-creation': 'error',
    'temp-file-security/no-symlink-temp-operations': 'error'
  }
};
\`\`\`

**Rules:**
- \`no-insecure-temp-file-creation\`: Detects insecure temp file creation patterns
- \`no-symlink-temp-operations\`: Detects operations on potentially symlinked temp files

## Usage Examples

### Basic File Upload with Temp Storage

\`\`\`typescript
import { SafeTempFileManager } from '@a4co/shared-utils/security/utils/safe-temp-file-manager';

class FileUploadService {
  private tempManager = new SafeTempFileManager();

  async handleUpload(file: Buffer, filename: string): Promise<string> {
    // Create secure temp file
    const tempFile = await this.tempManager.createTempFile({
      prefix: 'upload-',
      suffix: path.extname(filename)
    });

    // Write file securely
    await this.tempManager.writeTempFile(tempFile, file, {
      maxSize: 10 * 1024 * 1024 // 10MB limit
    });

    // Process file (scan for malware, validate content, etc.)
    const processedPath = await this.processFile(tempFile);

    // Cleanup temp file
    await this.tempManager.removeTempPath(tempFile);

    return processedPath;
  }
}
\`\`\`

### API with Temp Directory Creation

\`\`\`typescript
import { TempFileProtector } from '@a4co/shared-utils/security/middleware/temp-file-protector';

class DataProcessingAPI {
  private protector = new TempFileProtector();

  async processData(data: any): Promise<any> {
    // Create protected temp directory
    const workDir = await this.protector.createProtectedTempDir('process-');

    try {
      // Create temp files for processing
      const inputFile = path.join(workDir, 'input.json');
      const outputFile = path.join(workDir, 'output.json');

      // Validate operations
      if (!this.protector.protect('write', inputFile)) {
        throw new Error('Temp file operation blocked');
      }

      // Process data
      fs.writeFileSync(inputFile, JSON.stringify(data));
      const result = await this.runProcessing(inputFile, outputFile);

      return JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    } finally {
      // Cleanup
      fs.rmdirSync(workDir, { recursive: true });
    }
  }
}
\`\`\`

## Security Benefits

1. **Symlink Attack Prevention**: Blocks operations on symlinked files and directories
2. **Path Validation**: Ensures all temp operations are within allowed directories
3. **Secure Creation**: Uses fs.mkdtemp() for unpredictable directory names
4. **Automatic Cleanup**: Prevents temp file accumulation and information leakage
5. **Size Limits**: Prevents resource exhaustion attacks
6. **Audit Trail**: Comprehensive logging of all temp file operations

## Testing

Run the security tests:

\`\`\`bash
npm test -- temp-file-security.test.ts
\`\`\`

Tests cover:
- Path validation scenarios
- Symlink detection and blocking
- Secure temp file/directory creation
- Size limit enforcement
- Cleanup functionality
- Integration between components

## Configuration

Configure the security components:

\`\`\`typescript
const config = {
  allowedTempDirs: ['/tmp', '/var/tmp', '/dev/shm'],
  maxTempFileSize: 100 * 1024 * 1024, // 100MB
  allowSymlinks: false,
  validateParentDirs: true
};
\`\`\`

## Best Practices

1. **Always use the SafeTempFileManager** for temp file operations
2. **Validate all temp paths** before operations
3. **Enable auto-cleanup** to prevent resource leaks
4. **Set appropriate size limits** based on use case
5. **Run with minimal privileges** when possible
6. **Monitor temp file operations** for anomalies
7. **Use ESLint rules** to catch insecure patterns in code

## Migration Guide

Replace insecure temp file operations:

\`\`\`typescript
// ❌ Insecure
const tempDir = '/tmp/my-app-data';
fs.mkdirSync(tempDir);
fs.writeFileSync(path.join(tempDir, 'data.txt'), data);

// ✅ Secure
const manager = new SafeTempFileManager();
const tempFile = await manager.createTempFile({ prefix: 'data-' });
await manager.writeTempFile(tempFile, data);
\`\`\`

This mitigation framework provides comprehensive protection against temp file symlink attacks while maintaining usability and performance.`,
};

// File creation mapping
const fileMappings = [
  {
    template: 'temp-file-validator.ts',
    target: path.join(SHARED_UTILS_DIR, 'src', 'security', 'validators', 'temp-file.validator.ts'),
  },
  {
    template: 'temp-file-protector.ts',
    target: path.join(SHARED_UTILS_DIR, 'src', 'security', 'middleware', 'temp-file-protector.ts'),
  },
  {
    template: 'safe-temp-file-manager.ts',
    target: path.join(SHARED_UTILS_DIR, 'src', 'security', 'utils', 'safe-temp-file-manager.ts'),
  },
  {
    template: 'temp-file-security.test.ts',
    target: path.join(
      SHARED_UTILS_DIR,
      'src',
      'security',
      '__tests__',
      'temp-file-security.test.ts'
    ),
  },
  {
    template: 'temp-file-rules.js',
    target: path.join(ESLINT_DIR, 'temp-file-rules.js'),
  },
  {
    template: 'temp-file-symlink-mitigation.md',
    target: path.join(SCRIPTS_DIR, 'templates', 'temp-file-symlink-mitigation.md'),
  },
];

// Create files
fileMappings.forEach(({ template, target }) => {
  const content = templates[template];
  fs.writeFileSync(target, content);
  console.log('✅ Created: ' + target);
});

// Update package.json exports
const packageJsonPath = path.join(SHARED_UTILS_DIR, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  if (!packageJson.exports) packageJson.exports = {};

  packageJson.exports['./security/validators/temp-file.validator'] = {
    types: './dist/security/validators/temp-file.validator.d.ts',
    default: './dist/security/validators/temp-file.validator.js',
  };

  packageJson.exports['./security/middleware/temp-file-protector'] = {
    types: './dist/security/middleware/temp-file-protector.d.ts',
    default: './dist/security/middleware/temp-file-protector.js',
  };

  packageJson.exports['./security/utils/safe-temp-file-manager'] = {
    types: './dist/security/utils/safe-temp-file-manager.d.ts',
    default: './dist/security/utils/safe-temp-file-manager.js',
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json exports');
}

// Copy documentation to root
const docTarget = path.join(BASE_DIR, 'docs', 'temp-file-symlink-mitigation.md');
ensureDir(path.dirname(docTarget));
fs.copyFileSync(path.join(SCRIPTS_DIR, 'templates', 'temp-file-symlink-mitigation.md'), docTarget);
console.log('✅ Copied documentation to: ' + docTarget);

console.log('\n🎉 Temp File Symlink Attack Mitigation Framework Complete!');
console.log('\nNext steps:');
console.log('1. Run tests: npm test -- temp-file-security.test.ts');
console.log('2. Review and integrate ESLint rules');
console.log('3. Update your temp file operations to use the new secure utilities');
console.log('4. Configure allowed temp directories for your environment');
