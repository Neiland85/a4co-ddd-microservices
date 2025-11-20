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
export declare class MicromatchPatternValidator {
    private static readonly MAX_COMPLEXITY;
    private static readonly HIGH_RISK_THRESHOLD;
    private static readonly CRITICAL_RISK_THRESHOLD;
    static validatePattern(pattern: string): PatternValidationResult;
    static validatePatterns(patterns: string[]): PatternValidationResult[];
    static sanitizePattern(pattern: string): string;
    private static calculateComplexity;
    private static identifyIssues;
    private static assessRiskLevel;
    private static generateRecommendations;
}
//# sourceMappingURL=micromatch-pattern.validator.d.ts.map