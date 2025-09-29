import { logger } from '@a4co/observability';

/**
 * Micromatch Pattern Validator
 * Validates micromatch patterns for ReDoS vulnerabilities
 */

export interface PatternValidationResult {
  isValid: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complexity: number;
  issues: string[];
  recommendations: string[];
}

export interface PatternComplexityMetrics {
  starCount: number;
  braceCount: number;
  questionMarkCount: number;
  plusCount: number;
  alternationCount: number;
  nestedGroups: number;
  totalComplexity: number;
}

export class MicromatchPatternValidator {
  private static readonly MAX_COMPLEXITY = 100;
  private static readonly HIGH_RISK_THRESHOLD = 75;
  private static readonly CRITICAL_RISK_THRESHOLD = 90;

  /**
   * Validates a single micromatch pattern
   */
  static validatePattern(pattern: string): PatternValidationResult {
    if (!pattern || typeof pattern !== 'string') {
      return {
        isValid: false,
        riskLevel: 'critical',
        complexity: 0,
        issues: ['Pattern must be a non-empty string'],
        recommendations: ['Provide a valid pattern string'],
      };
    }

    const metrics = this.calculateComplexity(pattern);
    const issues = this.identifyIssues(pattern, metrics);
    const riskLevel = this.assessRiskLevel(metrics);
    const recommendations = this.generateRecommendations(issues, riskLevel);

    const isValid = riskLevel !== 'critical' && issues.length === 0;

    return {
      isValid,
      riskLevel,
      complexity: metrics.totalComplexity,
      issues,
      recommendations,
    };
  }

  /**
   * Validates multiple patterns
   */
  static validatePatterns(patterns: string[]): PatternValidationResult[] {
    return patterns.map(pattern => this.validatePattern(pattern));
  }

  /**
   * Sanitizes a pattern to reduce ReDoS risk
   */
  static sanitizePattern(pattern: string): string {
    if (!pattern) return pattern;

    // Remove excessive wildcards
    let sanitized = pattern
      .replace(/\*\*\*+/g, '**') // Multiple *** -> **
      .replace(/\*\*\/\*\*+/g, '**/') // **/*** -> **/
      .replace(/\*+/g, match => (match.length > 2 ? '**' : match)); // More than 2 * -> **

    // Limit brace expansions
    const braceMatches = sanitized.match(/\{[^}]*\}/g);
    if (braceMatches && braceMatches.length > 5) {
      logger.warn('Pattern contains excessive brace expansions, limiting to 5');
      const limited = braceMatches.slice(0, 5).join('');
      sanitized = sanitized.replace(/\{[^}]*\}/g, () => limited);
    }

    return sanitized;
  }

  /**
   * Calculates pattern complexity metrics
   */
  private static calculateComplexity(pattern: string): PatternComplexityMetrics {
    const starCount = (pattern.match(/\*/g) || []).length;
    const braceCount = (pattern.match(/\{/g) || []).length;
    const questionMarkCount = (pattern.match(/\?/g) || []).length;
    const plusCount = (pattern.match(/\+/g) || []).length;
    const alternationCount = (pattern.match(/\|/g) || []).length;

    // Count nested groups (approximate)
    const nestedGroups = (pattern.match(/\([^)]*\(/g) || []).length;

    // Calculate total complexity score
    const totalComplexity =
      starCount * 2 +
      braceCount * 3 +
      questionMarkCount * 1 +
      plusCount * 2 +
      alternationCount * 4 +
      nestedGroups * 5;

    return {
      starCount,
      braceCount,
      questionMarkCount,
      plusCount,
      alternationCount,
      nestedGroups,
      totalComplexity,
    };
  }

  /**
   * Identifies potential issues in the pattern
   */
  private static identifyIssues(pattern: string, metrics: PatternComplexityMetrics): string[] {
    const issues: string[] = [];

    if (metrics.starCount > 10) {
      issues.push('Excessive wildcard usage may cause performance issues');
    }

    if (metrics.braceCount > 5) {
      issues.push('Too many brace expansions increase complexity');
    }

    if (metrics.alternationCount > 3) {
      issues.push('Multiple alternations can lead to exponential backtracking');
    }

    if (metrics.nestedGroups > 2) {
      issues.push('Nested groups significantly increase ReDoS risk');
    }

    if (metrics.totalComplexity > this.CRITICAL_RISK_THRESHOLD) {
      issues.push('Pattern complexity exceeds critical threshold');
    }

    // Check for known dangerous patterns
    if (pattern.includes('**/**')) {
      issues.push('Double globstar pattern detected');
    }

    if (pattern.match(/\*\*\*[^*]/)) {
      issues.push('Triple asterisk pattern may cause issues');
    }

    return issues;
  }

  /**
   * Assesses the risk level based on complexity
   */
  private static assessRiskLevel(
    metrics: PatternComplexityMetrics
  ): 'low' | 'medium' | 'high' | 'critical' {
    const complexity = metrics.totalComplexity;

    if (complexity >= this.CRITICAL_RISK_THRESHOLD) {
      return 'critical';
    } else if (complexity >= this.HIGH_RISK_THRESHOLD) {
      return 'high';
    } else if (complexity >= 50) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Generates recommendations based on issues and risk level
   */
  private static generateRecommendations(issues: string[], riskLevel: string): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'critical') {
      recommendations.push('Reject this pattern - too risky for production use');
      recommendations.push('Consider using a safer alternative pattern');
    }

    if (issues.some(issue => issue.includes('wildcard'))) {
      recommendations.push('Reduce wildcard usage or use more specific patterns');
    }

    if (issues.some(issue => issue.includes('brace'))) {
      recommendations.push('Limit brace expansions to essential cases only');
    }

    if (issues.some(issue => issue.includes('alternation'))) {
      recommendations.push('Minimize alternation usage in patterns');
    }

    if (issues.some(issue => issue.includes('nested'))) {
      recommendations.push('Avoid nested groups when possible');
    }

    recommendations.push('Use MicromatchReDoSProtector for safe pattern matching');
    recommendations.push('Consider pre-validating patterns in development');

    return recommendations;
  }
}
