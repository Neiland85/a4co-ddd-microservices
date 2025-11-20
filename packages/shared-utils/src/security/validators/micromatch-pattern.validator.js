"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicromatchPatternValidator = void 0;
let logger;
try {
    const observability = require('@a4co/observability');
    logger = observability.getGlobalLogger();
}
catch {
    logger = {
        info: console.info,
        warn: console.warn,
        error: console.error,
    };
}
class MicromatchPatternValidator {
    static { this.MAX_COMPLEXITY = 100; }
    static { this.HIGH_RISK_THRESHOLD = 75; }
    static { this.CRITICAL_RISK_THRESHOLD = 90; }
    static validatePattern(pattern) {
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
    static validatePatterns(patterns) {
        return patterns.map(pattern => this.validatePattern(pattern));
    }
    static sanitizePattern(pattern) {
        if (!pattern)
            return pattern;
        let sanitized = pattern
            .replace(/\*\*\*+/g, '**')
            .replace(/\*\*\/\*\*+/g, '**/')
            .replace(/\*+/g, match => (match.length > 2 ? '**' : match));
        const braceMatches = sanitized.match(/\{[^}]*\}/g);
        if (braceMatches && braceMatches.length > 5) {
            logger.warn('Pattern contains excessive brace expansions, limiting to 5');
            const limited = braceMatches.slice(0, 5).join('');
            sanitized = sanitized.replace(/\{[^}]*\}/g, () => limited);
        }
        return sanitized;
    }
    static calculateComplexity(pattern) {
        const starCount = (pattern.match(/\*/g) || []).length;
        const braceCount = (pattern.match(/\{/g) || []).length;
        const questionMarkCount = (pattern.match(/\?/g) || []).length;
        const plusCount = (pattern.match(/\+/g) || []).length;
        const alternationCount = (pattern.match(/\|/g) || []).length;
        const nestedGroups = (pattern.match(/\([^)]*\(/g) || []).length;
        const totalComplexity = starCount * 2 +
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
    static identifyIssues(pattern, metrics) {
        const issues = [];
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
        if (pattern.includes('**/**')) {
            issues.push('Double globstar pattern detected');
        }
        if (pattern.match(/\*\*\*[^*]/)) {
            issues.push('Triple asterisk pattern may cause issues');
        }
        return issues;
    }
    static assessRiskLevel(metrics) {
        const complexity = metrics.totalComplexity;
        if (complexity >= this.CRITICAL_RISK_THRESHOLD) {
            return 'critical';
        }
        else if (complexity >= this.HIGH_RISK_THRESHOLD) {
            return 'high';
        }
        else if (complexity >= 50) {
            return 'medium';
        }
        else {
            return 'low';
        }
    }
    static generateRecommendations(issues, riskLevel) {
        const recommendations = [];
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
exports.MicromatchPatternValidator = MicromatchPatternValidator;
//# sourceMappingURL=micromatch-pattern.validator.js.map