export declare class IPRangeBlocker {
    private static readonly BLOCKED_RANGES;
    static isBlockedIP(ip: string): {
        isBlocked: boolean;
        reason?: string;
    };
    private static isBlockedHostname;
    private static isValidIP;
    private static isIPInRange;
    static getBlockedRanges(): Array<{
        name: string;
        range: string;
    }>;
    static containsBlockedIP(url: string): {
        isBlocked: boolean;
        reason?: string;
    };
}
export default IPRangeBlocker;
//# sourceMappingURL=ip-range-blocker.d.ts.map