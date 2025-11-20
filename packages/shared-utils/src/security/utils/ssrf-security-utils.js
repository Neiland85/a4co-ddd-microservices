"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSRFSecurityUtils = void 0;
const url_validator_1 = require("../validators/url.validator");
const ip_range_blocker_1 = require("./ip-range-blocker");
class SSRFSecurityUtils {
    static validateAndSanitizeURL(url) {
        const validation = url_validator_1.URLValidator.validateURL(url);
        if (!validation.isValid) {
            return {
                isValid: false,
                violations: validation.violations
            };
        }
        const sanitized = url_validator_1.URLValidator.sanitizeURL(url);
        return {
            isValid: true,
            sanitizedURL: sanitized,
            violations: []
        };
    }
    static isSafeForFetch(url) {
        const validation = url_validator_1.URLValidator.validateURL(url);
        if (!validation.isValid) {
            return { isSafe: false, reason: validation.violations.join(', ') };
        }
        const ipCheck = ip_range_blocker_1.IPRangeBlocker.containsBlockedIP(url);
        if (ipCheck.isBlocked) {
            return { isSafe: false, reason: ipCheck.reason };
        }
        return { isSafe: true };
    }
    static async safeFetch(url, options) {
        const safetyCheck = this.isSafeForFetch(url);
        if (!safetyCheck.isSafe) {
            throw new Error(`Unsafe URL blocked: ${safetyCheck.reason}`);
        }
        const sanitized = url_validator_1.URLValidator.sanitizeURL(url);
        return fetch(sanitized, options);
    }
    static generateSecureHeaders() {
        return {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
        };
    }
    static validateQueryParams(params) {
        const violations = [];
        for (const [key, value] of Object.entries(params)) {
            if (this.looksLikeURL(value)) {
                const validation = url_validator_1.URLValidator.validateURL(value);
                if (!validation.isValid) {
                    violations.push(`Parameter '${key}': ${validation.violations.join(', ')}`);
                }
            }
        }
        return {
            isValid: violations.length === 0,
            violations
        };
    }
    static looksLikeURL(str) {
        try {
            new URL(str);
            return true;
        }
        catch {
            return str.startsWith('http://') || str.startsWith('https://') ||
                str.includes('://') || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(str);
        }
    }
    static logSecurityEvent(event) {
        const logEntry = {
            timestamp: event.timestamp || new Date(),
            type: event.type,
            url: event.url,
            violations: event.violations,
            ip: event.ip,
            userAgent: event.userAgent,
            severity: 'HIGH'
        };
        console.warn('SECURITY EVENT:', JSON.stringify(logEntry, null, 2));
    }
}
exports.SSRFSecurityUtils = SSRFSecurityUtils;
exports.default = SSRFSecurityUtils;
//# sourceMappingURL=ssrf-security-utils.js.map