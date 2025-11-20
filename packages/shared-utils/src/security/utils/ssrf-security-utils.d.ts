export declare class SSRFSecurityUtils {
    static validateAndSanitizeURL(url: string): {
        isValid: boolean;
        sanitizedURL?: string;
        violations: string[];
    };
    static isSafeForFetch(url: string): {
        isSafe: boolean;
        reason?: string;
    };
    static safeFetch(url: string, options?: RequestInit): Promise<Response>;
    static generateSecureHeaders(): Record<string, string>;
    static validateQueryParams(params: Record<string, string>): {
        isValid: boolean;
        violations: string[];
    };
    private static looksLikeURL;
    static logSecurityEvent(event: {
        type: 'ssrf_attempt' | 'redirect_blocked' | 'unsafe_url';
        url?: string;
        violations?: string[];
        ip?: string;
        userAgent?: string;
        timestamp?: Date;
    }): void;
}
export default SSRFSecurityUtils;
//# sourceMappingURL=ssrf-security-utils.d.ts.map