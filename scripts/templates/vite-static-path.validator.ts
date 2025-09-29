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
 * Vite Static Path Validator
 * Validates static file paths for security vulnerabilities
 */

export interface PathValidationResult {
  isValid: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  issues: string[];
  recommendations: string[];
  normalizedPath: string;
  isSensitive: boolean;
}

export interface StaticFileConfig {
  allowedExtensions: string[];
  sensitiveDirectories: string[];
  sensitiveFiles: string[];
  allowHtmlFiles: boolean;
  allowDotFiles: boolean;
}

export class ViteStaticPathValidator {
  private static readonly DEFAULT_CONFIG: StaticFileConfig = {
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
  };

  /**
   * Validates a static file path
   */
  static validatePath(path: string, config: Partial<StaticFileConfig> = {}): PathValidationResult {
    if (!path || typeof path !== 'string') {
      return {
        isValid: false,
        riskLevel: 'critical',
        issues: ['Path must be a non-empty string'],
        recommendations: ['Provide a valid file path'],
        normalizedPath: '',
        isSensitive: false,
      };
    }

    const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
    const normalizedPath = this.normalizePath(path);
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for directory traversal
    if (this.hasDirectoryTraversal(normalizedPath)) {
      issues.push('Path contains directory traversal (..) which is not allowed');
      recommendations.push('Remove directory traversal from path');
    }

    // Check for sensitive directories
    if (this.isSensitiveDirectory(normalizedPath, fullConfig.sensitiveDirectories)) {
      issues.push('Path points to sensitive directory');
      recommendations.push('Restrict access to sensitive directories');
    }

    // Check for sensitive files
    if (this.isSensitiveFile(normalizedPath, fullConfig.sensitiveFiles)) {
      issues.push('Path points to sensitive file');
      recommendations.push('Block access to sensitive files');
    }

    // Check file extensions
    const extension = this.getFileExtension(normalizedPath);
    if (extension) {
      if (!fullConfig.allowHtmlFiles && extension === '.html') {
        issues.push('HTML files are not allowed to be served statically');
        recommendations.push('Disable HTML file serving or use proper routing');
      }

      if (!fullConfig.allowedExtensions.includes(extension.toLowerCase())) {
        issues.push(`File extension '${extension}' is not in allowed list`);
        recommendations.push('Add extension to allowed list or block the file');
      }
    }

    // Check for dot files
    if (!fullConfig.allowDotFiles && this.isDotFile(normalizedPath)) {
      issues.push('Dot files are not allowed');
      recommendations.push('Block access to dot files or enable if necessary');
    }

    // Check for suspicious patterns
    if (this.hasSuspiciousPatterns(normalizedPath)) {
      issues.push('Path contains suspicious patterns');
      recommendations.push('Review path for potential security issues');
    }

    const isSensitive =
      this.isSensitiveDirectory(normalizedPath, fullConfig.sensitiveDirectories) ||
      this.isSensitiveFile(normalizedPath, fullConfig.sensitiveFiles);

    const riskLevel = this.assessRiskLevel(issues, isSensitive);
    const isValid = riskLevel !== 'critical' && issues.length === 0;

    return {
      isValid,
      riskLevel,
      issues,
      recommendations,
      normalizedPath,
      isSensitive,
    };
  }

  /**
   * Validates multiple paths
   */
  static validatePaths(
    paths: string[],
    config?: Partial<StaticFileConfig>
  ): PathValidationResult[] {
    return paths.map(path => this.validatePath(path, config));
  }

  /**
   * Sanitizes a path to prevent directory traversal
   */
  static sanitizePath(path: string): string {
    if (!path) return path;

    // Remove directory traversal
    let sanitized = path.replace(/\.\./g, '');

    // Remove leading slashes that could cause issues
    sanitized = sanitized.replace(/^\/+/, '');

    // Normalize path separators
    sanitized = sanitized.replace(/\\/g, '/');

    return sanitized;
  }

  /**
   * Checks if a path should be blocked
   */
  static shouldBlockPath(path: string, config?: Partial<StaticFileConfig>): boolean {
    const result = this.validatePath(path, config);
    return !result.isValid || result.isSensitive;
  }

  /**
   * Normalizes a path for consistent processing
   */
  private static normalizePath(path: string): string {
    return path.replace(/\\/g, '/').replace(/^\/+/, '');
  }

  /**
   * Checks for directory traversal attacks
   */
  private static hasDirectoryTraversal(path: string): boolean {
    return path.includes('..') || path.includes('\\..') || path.includes('../');
  }

  /**
   * Checks if path points to sensitive directory
   */
  private static isSensitiveDirectory(path: string, sensitiveDirs: string[]): boolean {
    const pathParts = path.split('/').filter(p => p);
    return pathParts.some(part => sensitiveDirs.includes(part));
  }

  /**
   * Checks if path points to sensitive file
   */
  private static isSensitiveFile(path: string, sensitiveFiles: string[]): boolean {
    const filename = path.split('/').pop() || '';
    return sensitiveFiles.some(sensitive => filename.includes(sensitive));
  }

  /**
   * Gets file extension
   */
  private static getFileExtension(path: string): string | null {
    const match = path.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1] : null;
  }

  /**
   * Checks if file is a dot file
   */
  private static isDotFile(path: string): boolean {
    const filename = path.split('/').pop() || '';
    return filename.startsWith('.');
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
  private static assessRiskLevel(
    issues: string[],
    isSensitive: boolean
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (isSensitive) return 'critical';

    if (issues.some(issue => issue.includes('directory traversal'))) return 'critical';
    if (issues.some(issue => issue.includes('sensitive'))) return 'high';
    if (issues.some(issue => issue.includes('HTML files') || issue.includes('dot files')))
      return 'medium';

    return issues.length > 0 ? 'low' : 'low';
  }
}
