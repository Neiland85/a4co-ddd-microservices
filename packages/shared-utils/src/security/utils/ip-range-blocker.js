"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPRangeBlocker = void 0;
class IPRangeBlocker {
    static { this.BLOCKED_RANGES = [
        { name: 'RFC1918-10', range: '10.0.0.0/8', cidr: [10, 0, 0, 0, 8] },
        { name: 'RFC1918-172', range: '172.16.0.0/12', cidr: [172, 16, 0, 0, 12] },
        { name: 'RFC1918-192', range: '192.168.0.0/16', cidr: [192, 168, 0, 0, 16] },
        { name: 'Loopback', range: '127.0.0.0/8', cidr: [127, 0, 0, 0, 8] },
        { name: 'Link-local', range: '169.254.0.0/16', cidr: [169, 254, 0, 0, 16] },
        { name: 'AWS-IMDS', range: '169.254.169.254/32', cidr: [169, 254, 169, 254, 32] },
        { name: 'Azure-IMDS', range: '168.63.129.16/32', cidr: [168, 63, 129, 16, 32] },
        { name: 'GCP-Metadata', range: 'metadata.google.internal', cidr: null },
        { name: 'Oracle-Cloud', range: '192.0.0.192/32', cidr: [192, 0, 0, 192, 32] },
        { name: 'Alibaba-Cloud', range: '100.100.100.200/32', cidr: [100, 100, 100, 200, 32] }
    ]; }
    static isBlockedIP(ip) {
        if (!ip || typeof ip !== 'string') {
            return { isBlocked: false };
        }
        if (this.isBlockedHostname(ip)) {
            return { isBlocked: true, reason: 'Blocked hostname' };
        }
        if (this.isValidIP(ip)) {
            for (const range of this.BLOCKED_RANGES) {
                if (range.cidr && this.isIPInRange(ip, range.cidr)) {
                    return { isBlocked: true, reason: `Blocked range: ${range.name} (${range.range})` };
                }
            }
        }
        return { isBlocked: false };
    }
    static isBlockedHostname(hostname) {
        const blockedHostnames = [
            'localhost',
            'metadata.google.internal',
            '169.254.169.254',
            '168.63.129.16',
            '192.0.0.192',
            '100.100.100.200'
        ];
        return blockedHostnames.includes(hostname.toLowerCase());
    }
    static isValidIP(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4)
            return false;
        return parts.every(part => {
            const num = parseInt(part);
            return num >= 0 && num <= 255 && part === num.toString();
        });
    }
    static isIPInRange(ip, cidr) {
        const [rangeIP1, rangeIP2, rangeIP3, rangeIP4, prefix] = cidr;
        const [ip1, ip2, ip3, ip4] = ip.split('.').map(Number);
        if (prefix === 8) {
            return ip1 === rangeIP1;
        }
        else if (prefix === 12) {
            return ip1 === rangeIP1 && (ip2 & 0xF0) === (rangeIP2 & 0xF0);
        }
        else if (prefix === 16) {
            return ip1 === rangeIP1 && ip2 === rangeIP2;
        }
        else if (prefix === 32) {
            return ip1 === rangeIP1 && ip2 === rangeIP2 && ip3 === rangeIP3 && ip4 === rangeIP4;
        }
        return false;
    }
    static getBlockedRanges() {
        return this.BLOCKED_RANGES.map(({ name, range }) => ({ name, range }));
    }
    static containsBlockedIP(url) {
        try {
            const urlObj = new URL(url);
            return this.isBlockedIP(urlObj.hostname);
        }
        catch (error) {
            return { isBlocked: false };
        }
    }
}
exports.IPRangeBlocker = IPRangeBlocker;
exports.default = IPRangeBlocker;
//# sourceMappingURL=ip-range-blocker.js.map