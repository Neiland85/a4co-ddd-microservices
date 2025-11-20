"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ip_range_blocker_1 = require("../utils/ip-range-blocker");
const ssrf_security_utils_1 = require("../utils/ssrf-security-utils");
const url_validator_1 = require("../validators/url.validator");
describe('Next.js SSRF Security Mitigations', () => {
    describe('URLValidator', () => {
        it('should allow safe external URLs', () => {
            const result = url_validator_1.URLValidator.validateURL('https://api.github.com/users/octocat');
            expect(result.isValid).toBe(true);
            expect(result.violations).toEqual([]);
        });
        it('should block localhost', () => {
            const result = url_validator_1.URLValidator.validateURL('http://localhost:3000/api');
            expect(result.isValid).toBe(false);
            expect(result.violations).toContain('Blocked hostname: localhost');
        });
        it('should block private IP ranges', () => {
            const result = url_validator_1.URLValidator.validateURL('http://10.0.0.1:8080');
            expect(result.isValid).toBe(false);
            expect(result.violations).toContain('Blocked IP range: 10.0.0.1');
        });
        it('should block AWS IMDS', () => {
            const result = url_validator_1.URLValidator.validateURL('http://169.254.169.254/latest/meta-data/');
            expect(result.isValid).toBe(false);
            expect(result.violations).toContain('Blocked IP range: 169.254.169.254');
        });
        it('should block Azure IMDS', () => {
            const result = url_validator_1.URLValidator.validateURL('http://168.63.129.16/metadata');
            expect(result.isValid).toBe(false);
            expect(result.violations).toContain('Blocked IP range: 168.63.129.16');
        });
        it('should sanitize URLs', () => {
            const url = 'https://user:pass@example.com/path?query=value#fragment';
            const sanitized = url_validator_1.URLValidator.sanitizeURL(url);
            expect(sanitized).toBe('https://example.com/path?query=value');
        });
    });
    describe('IPRangeBlocker', () => {
        it('should block RFC1918 ranges', () => {
            expect(ip_range_blocker_1.IPRangeBlocker.isBlockedIP('10.0.0.1').isBlocked).toBe(true);
            expect(ip_range_blocker_1.IPRangeBlocker.isBlockedIP('172.16.0.1').isBlocked).toBe(true);
            expect(ip_range_blocker_1.IPRangeBlocker.isBlockedIP('192.168.1.1').isBlocked).toBe(true);
        });
        it('should block cloud metadata IPs', () => {
            expect(ip_range_blocker_1.IPRangeBlocker.isBlockedIP('169.254.169.254').isBlocked).toBe(true);
            expect(ip_range_blocker_1.IPRangeBlocker.isBlockedIP('168.63.129.16').isBlocked).toBe(true);
            expect(ip_range_blocker_1.IPRangeBlocker.isBlockedIP('metadata.google.internal').isBlocked).toBe(true);
        });
        it('should allow public IPs', () => {
            expect(ip_range_blocker_1.IPRangeBlocker.isBlockedIP('8.8.8.8').isBlocked).toBe(false);
            expect(ip_range_blocker_1.IPRangeBlocker.isBlockedIP('1.1.1.1').isBlocked).toBe(false);
        });
    });
    describe('SSRFSecurityUtils', () => {
        it('should validate safe URLs', () => {
            const result = ssrf_security_utils_1.SSRFSecurityUtils.validateAndSanitizeURL('https://api.example.com/data');
            expect(result.isValid).toBe(true);
            expect(result.sanitizedURL).toBeDefined();
        });
        it('should reject unsafe URLs', () => {
            const result = ssrf_security_utils_1.SSRFSecurityUtils.validateAndSanitizeURL('http://127.0.0.1:8080');
            expect(result.isValid).toBe(false);
            expect(result.violations.length).toBeGreaterThan(0);
        });
        it('should detect URLs in query params', () => {
            const params = {
                redirect: 'http://localhost:3000',
                callback: 'https://safe.example.com',
            };
            const result = ssrf_security_utils_1.SSRFSecurityUtils.validateQueryParams(params);
            expect(result.isValid).toBe(false);
            expect(result.violations).toContain("Parameter 'redirect': Blocked hostname: localhost");
        });
        it('should generate secure headers', () => {
            const headers = ssrf_security_utils_1.SSRFSecurityUtils.generateSecureHeaders();
            expect(headers).toHaveProperty('X-Content-Type-Options');
            expect(headers).toHaveProperty('X-Frame-Options');
            expect(headers).toHaveProperty('Content-Security-Policy');
        });
    });
});
//# sourceMappingURL=nextjs-ssrf.test.js.map