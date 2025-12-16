/**
 * Vite Static Path Validator
 * Validates and sanitizes paths for static file serving
 */

export interface StaticFileConfig {
  allowedExtensions?: string[];
  sensitiveDirectories?: string[];
  sensitiveFiles?: string[];
  maxPathLength?: number;
  allowDotFiles?: boolean;
}

export interface PathValidationResult {
  isValid: boolean;
  sanitizedPath?: string;
  error?: string;
  blockedReason?: string;
}

export class ViteStaticPathValidator {
  private static readonly DEFAULT_MAX_PATH_LENGTH = 1024;
  private static readonly PATH_TRAVERSAL_PATTERNS = [/\.\./, /~\//, /\0/, /%2e%2e/i, /%252e%252e/i];

  private config: Required<StaticFileConfig>;

  constructor(config: StaticFileConfig = {}) {
    this.config = {
      allowedExtensions: config.allowedExtensions || [
        '.js',
        '.css',
        '.html',
        '.json',
        '.svg',
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.ico',
        '.woff',
        '.woff2',
        '.ttf',
        '.eot',
        '.map',
      ],
      sensitiveDirectories: config.sensitiveDirectories || [
        'node_modules',
        '.git',
        '.env',
        'config',
        'secrets',
      ],
      sensitiveFiles: config.sensitiveFiles || [
        '.env',
        '.env.local',
        '.env.development',
        '.env.production',
        'package.json',
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
      ],
      maxPathLength: config.maxPathLength || ViteStaticPathValidator.DEFAULT_MAX_PATH_LENGTH,
      allowDotFiles: config.allowDotFiles || false,
    };
  }

  /**
   * Validates a file path for static serving
   */
  validate(filePath: string): PathValidationResult {
    // Check path length
    if (filePath.length > this.config.maxPathLength) {
      return {
        isValid: false,
        error: 'Path exceeds maximum length',
        blockedReason: 'path_too_long',
      };
    }

    // Check for path traversal attempts
    for (const pattern of ViteStaticPathValidator.PATH_TRAVERSAL_PATTERNS) {
      if (pattern.test(filePath)) {
        return {
          isValid: false,
          error: 'Path traversal attempt detected',
          blockedReason: 'path_traversal',
        };
      }
    }

    // Check for sensitive directories
    for (const dir of this.config.sensitiveDirectories) {
      if (filePath.includes(`/${dir}/`) || filePath.startsWith(`${dir}/`)) {
        return {
          isValid: false,
          error: `Access to sensitive directory '${dir}' is not allowed`,
          blockedReason: 'sensitive_directory',
        };
      }
    }

    // Check for sensitive files
    const fileName = filePath.split('/').pop() || '';
    if (this.config.sensitiveFiles.includes(fileName)) {
      return {
        isValid: false,
        error: `Access to sensitive file '${fileName}' is not allowed`,
        blockedReason: 'sensitive_file',
      };
    }

    // Check for dot files
    if (!this.config.allowDotFiles && fileName.startsWith('.')) {
      return {
        isValid: false,
        error: 'Access to hidden files is not allowed',
        blockedReason: 'hidden_file',
      };
    }

    // Check file extension
    const extension = fileName.includes('.') ? `.${fileName.split('.').pop()}` : '';
    if (extension && !this.config.allowedExtensions.includes(extension.toLowerCase())) {
      return {
        isValid: false,
        error: `File extension '${extension}' is not allowed`,
        blockedReason: 'invalid_extension',
      };
    }

    // Sanitize path
    const sanitizedPath = this.sanitizePath(filePath);

    return {
      isValid: true,
      sanitizedPath,
    };
  }

  /**
   * Sanitizes a file path
   */
  private sanitizePath(filePath: string): string {
    return filePath.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\//, '');
  }

  /**
   * Checks if a path is safe
   */
  static isSafePath(filePath: string): boolean {
    const validator = new ViteStaticPathValidator();
    return validator.validate(filePath).isValid;
  }
}
