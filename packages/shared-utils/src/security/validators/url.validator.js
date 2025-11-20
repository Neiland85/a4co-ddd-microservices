"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLValidator = void 0;
class URLValidator {
    static { this.BLOCKED_IP_RANGES = [
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^192\.168\./,
        /^127\./,
        /^0\./,
        /^169\.254\./,
        /^169\.254\.169\.254$/,
        /^100\.100\.100\.200$/,
        /^192\.0\.0\.192$/,
        /^168\.63\.129\.16$/,
        /^metadata\.google\.internal$/,
    ]; }
    static { this.BLOCKED_HOSTNAMES = [
        'localhost',
        'metadata.google.internal',
        '169.254.169.254',
        '100.100.100.200',
        '192.0.0.192',
        '168.63.129.16',
        'internal',
        'local',
        '127.0.0.1',
        '0.0.0.0',
    ]; }
    static { this.ALLOWED_SCHEMES = ['http', 'https']; }
    static validateURL(url) {
        const violations = [];
        if (!url || typeof url !== 'string') {
            violations.push('URL is empty or not a string');
            return { isValid: false, violations };
        }
        try {
            const urlObj = new URL(url);
            if (!this.ALLOWED_SCHEMES.includes(urlObj.protocol.replace(':', ''))) {
                violations.push(`Invalid scheme: ${urlObj.protocol}`);
            }
            if (this.BLOCKED_HOSTNAMES.includes(urlObj.hostname.toLowerCase())) {
                violations.push(`Blocked hostname: ${urlObj.hostname}`);
            }
            const hostname = urlObj.hostname;
            if (this.isIPAddress(hostname)) {
                for (const range of this.BLOCKED_IP_RANGES) {
                    if (range.test(hostname)) {
                        violations.push(`Blocked IP range: ${hostname}`);
                        break;
                    }
                }
            }
            if (urlObj.port) {
                const port = parseInt(urlObj.port);
                if (this.isInternalPort(port)) {
                    violations.push(`Blocked internal port: ${port}`);
                }
            }
        }
        catch (error) {
            violations.push(`Invalid URL format: ${error instanceof Error ? error.message : String(error)}`);
        }
        return {
            isValid: violations.length === 0,
            violations,
        };
    }
    static isIPAddress(hostname) {
        const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
        return ipRegex.test(hostname);
    }
    static isInternalPort(port) {
        const internalPorts = [
            22,
            25,
            53,
            80,
            443,
            3306,
            5432,
            6379,
            8080,
            8443,
            9200,
            27017,
        ];
        return internalPorts.includes(port) || port < 1024;
    }
    static sanitizeURL(url) {
        if (!url || typeof url !== 'string')
            return url;
        try {
            const urlObj = new URL(url);
            urlObj.username = '';
            urlObj.password = '';
            urlObj.hash = '';
            return urlObj.toString();
        }
        catch (error) {
            return url;
        }
    }
    static isInAllowlist(url, allowlist) {
        if (!url || !allowlist || allowlist.length === 0)
            return false;
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.toLowerCase();
            return allowlist.some(allowed => {
                const pattern = allowed.replace(/\*/g, '.*');
                const regex = new RegExp(`^${pattern}$`, 'i');
                return regex.test(hostname);
            });
        }
        catch (error) {
            return false;
        }
    }
}
exports.URLValidator = URLValidator;
exports.default = URLValidator;
//# sourceMappingURL=url.validator.js.map