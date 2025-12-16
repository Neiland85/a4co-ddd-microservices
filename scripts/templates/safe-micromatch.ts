// Import opcional para observabilidad (fallback a console si no está disponible)
let logger: any;
try {
  const observability = require('@a4co/observability');
  logger = observability.logger;
} catch {
  logger = {
    info: console.info,
    warn: console.warn,
    error: console.error,
  };
}
import micromatch from 'micromatch';
import { MicromatchPatternValidator } from './micromatch-pattern.validator';
import { MicromatchReDoSProtector } from './micromatch-redos-protector';

/**
 * Safe Micromatch Wrapper
 * Provides drop-in replacements for micromatch with built-in security controls
 */

export interface SafeMicromatchOptions {
  timeout?: number;
  allowRiskyPatterns?: boolean;
  enableCircuitBreaker?: boolean;
  context?: string;
}

export class SafeMicromatch {
  private protector: MicromatchReDoSProtector;

  constructor(options: SafeMicromatchOptions = {}) {
    this.protector = new MicromatchReDoSProtector();
  }

  /**
   * Safely matches strings against patterns
   */
  async match(
    list: string[],
    patterns: string | string[],
    options?: micromatch.Options,
  ): Promise<string[]> {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];

    const result = await this.protector.safeMatch(
      () => micromatch.match(list, patterns, options),
      patternArray,
      { context: 'SafeMicromatch.match' },
    );

    if (!result.success) {
      logger.error('SafeMicromatch.match failed', {
        error: result.error,
        patterns: patternArray,
        executionTime: result.executionTime,
      });

      // Return empty array on failure as safe default
      return [];
    }

    return result.result || [];
  }

  /**
   * Safely checks if a string matches any pattern
   */
  async isMatch(
    str: string,
    patterns: string | string[],
    options?: micromatch.Options,
  ): Promise<boolean> {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];

    const result = await this.protector.safeMatch(
      () => micromatch.isMatch(str, patterns, options),
      patternArray,
      { context: 'SafeMicromatch.isMatch' },
    );

    if (!result.success) {
      logger.error('SafeMicromatch.isMatch failed', {
        error: result.error,
        str,
        patterns: patternArray,
        executionTime: result.executionTime,
      });

      // Return false on failure as safe default
      return false;
    }

    return result.result || false;
  }

  /**
   * Safely creates a regex from patterns
   */
  async makeRe(pattern: string, options?: micromatch.Options): Promise<RegExp | null> {
    const result = await this.protector.safeMatch(
      () => micromatch.makeRe(pattern, options),
      [pattern],
      { context: 'SafeMicromatch.makeRe' },
    );

    if (!result.success) {
      logger.error('SafeMicromatch.makeRe failed', {
        error: result.error,
        pattern,
        executionTime: result.executionTime,
      });

      return null;
    }

    return result.result || null;
  }

  /**
   * Safely checks if any item in a list matches any pattern
   */
  async some(
    list: string[],
    patterns: string | string[],
    options?: micromatch.Options,
  ): Promise<boolean> {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];

    const result = await this.protector.safeMatch(
      () => micromatch.some(list, patterns, options),
      patternArray,
      { context: 'SafeMicromatch.some' },
    );

    if (!result.success) {
      logger.error('SafeMicromatch.some failed', {
        error: result.error,
        patterns: patternArray,
        executionTime: result.executionTime,
      });

      return false;
    }

    return result.result || false;
  }

  /**
   * Safely checks if every item in a list matches patterns
   */
  async every(
    list: string[],
    patterns: string | string[],
    options?: micromatch.Options,
  ): Promise<boolean> {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];

    const result = await this.protector.safeMatch(
      () => micromatch.every(list, patterns, options),
      patternArray,
      { context: 'SafeMicromatch.every' },
    );

    if (!result.success) {
      logger.error('SafeMicromatch.every failed', {
        error: result.error,
        patterns: patternArray,
        executionTime: result.executionTime,
      });

      return false;
    }

    return result.result || false;
  }

  /**
   * Safely finds all items that match any pattern
   */
  async all(
    list: string[],
    patterns: string | string[],
    options?: micromatch.Options,
  ): Promise<string[]> {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];

    const result = await this.protector.safeMatch(
      () => micromatch.all(list, patterns, options),
      patternArray,
      { context: 'SafeMicromatch.all' },
    );

    if (!result.success) {
      logger.error('SafeMicromatch.all failed', {
        error: result.error,
        patterns: patternArray,
        executionTime: result.executionTime,
      });

      return [];
    }

    return (Array.isArray(result.result) ? result.result : []) as string[];
  }

  /**
   * Safely finds items that don't match patterns
   */
  async not(
    list: string[],
    patterns: string | string[],
    options?: micromatch.Options,
  ): Promise<string[]> {
    const patternArray = Array.isArray(patterns) ? patterns : [patterns];

    const result = await this.protector.safeMatch(
      () => micromatch.not(list, patterns, options),
      patternArray,
      { context: 'SafeMicromatch.not' },
    );

    if (!result.success) {
      logger.error('SafeMicromatch.not failed', {
        error: result.error,
        patterns: patternArray,
        executionTime: result.executionTime,
      });

      return list; // Return original list on failure
    }

    return result.result || list;
  }

  /**
   * Gets current statistics
   */
  getStats() {
    return this.protector.getStats();
  }

  /**
   * Validates patterns without executing them
   */
  validatePatterns(
    patterns: string[],
  ): import('./micromatch-pattern.validator').PatternValidationResult[] {
    return MicromatchPatternValidator.validatePatterns(patterns);
  }

  /**
   * Sanitizes patterns to reduce ReDoS risk
   */
  sanitizePattern(pattern: string): string {
    return MicromatchPatternValidator.sanitizePattern(pattern);
  }
}

// Factory functions for convenience
export function createSafeMicromatch(options?: SafeMicromatchOptions): SafeMicromatch {
  return new SafeMicromatch(options);
}

export async function safeMatch(
  list: string[],
  patterns: string | string[],
  options?: micromatch.Options & SafeMicromatchOptions,
): Promise<string[]> {
  const safe = new SafeMicromatch(options);
  return safe.match(list, patterns, options);
}

export async function safeIsMatch(
  str: string,
  patterns: string | string[],
  options?: micromatch.Options & SafeMicromatchOptions,
): Promise<boolean> {
  const safe = new SafeMicromatch(options);
  return safe.isMatch(str, patterns, options);
}

export async function safeMakeRe(
  pattern: string,
  options?: micromatch.Options & SafeMicromatchOptions,
): Promise<RegExp | null> {
  const safe = new SafeMicromatch(options);
  return safe.makeRe(pattern, options);
}
