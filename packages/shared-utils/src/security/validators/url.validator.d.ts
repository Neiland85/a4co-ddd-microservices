export declare class URLValidator {
    private static readonly BLOCKED_IP_RANGES;
    private static readonly BLOCKED_HOSTNAMES;
    private static readonly ALLOWED_SCHEMES;
    static validateURL(url: string): {
        isValid: boolean;
        violations: string[];
    };
    private static isIPAddress;
    private static isInternalPort;
    static sanitizeURL(url: string): string;
    static isInAllowlist(url: string, allowlist: string[]): boolean;
}
export default URLValidator;
//# sourceMappingURL=url.validator.d.ts.map