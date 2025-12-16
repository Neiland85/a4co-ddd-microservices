/**
 * Vite Static File Protector
 * Middleware for protecting static file access
 */

import {
  ViteStaticPathValidator,
  StaticFileConfig,
  PathValidationResult,
} from '../validators/vite-static-path.validator';

export interface AccessAttempt {
  path: string;
  timestamp: number;
  allowed: boolean;
  blockedReason?: string;
}

export interface ProtectionStats {
  totalRequests: number;
  allowedRequests: number;
  blockedRequests: number;
  recentAttempts: AccessAttempt[];
}

export class ViteStaticFileProtector {
  private validator: ViteStaticPathValidator;
  private stats: ProtectionStats;
  private maxRecentAttempts: number;

  constructor(config: StaticFileConfig = {}, maxRecentAttempts = 100) {
    this.validator = new ViteStaticPathValidator(config);
    this.maxRecentAttempts = maxRecentAttempts;
    this.stats = {
      totalRequests: 0,
      allowedRequests: 0,
      blockedRequests: 0,
      recentAttempts: [],
    };
  }

  /**
   * Validates a file access request
   */
  validateAccess(filePath: string): PathValidationResult {
    this.stats.totalRequests++;

    const result = this.validator.validate(filePath);

    // Record attempt
    const attempt: AccessAttempt = {
      path: filePath,
      timestamp: Date.now(),
      allowed: result.isValid,
      blockedReason: result.blockedReason,
    };

    this.stats.recentAttempts.push(attempt);
    if (this.stats.recentAttempts.length > this.maxRecentAttempts) {
      this.stats.recentAttempts.shift();
    }

    if (result.isValid) {
      this.stats.allowedRequests++;
    } else {
      this.stats.blockedRequests++;
    }

    return result;
  }

  /**
   * Gets protection statistics
   */
  getStats(): ProtectionStats {
    return {
      ...this.stats,
      recentAttempts: [...this.stats.recentAttempts],
    };
  }

  /**
   * Resets statistics
   */
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      allowedRequests: 0,
      blockedRequests: 0,
      recentAttempts: [],
    };
  }

  /**
   * Gets recent blocked attempts
   */
  getRecentBlockedAttempts(limit = 10): AccessAttempt[] {
    return this.stats.recentAttempts
      .filter((a) => !a.allowed)
      .slice(-limit)
      .reverse();
  }
}
