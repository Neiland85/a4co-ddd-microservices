"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevServerValidator = void 0;
class DevServerValidator {
    constructor() {
        this.ALLOWED_HOSTS = ['localhost', '127.0.0.1', '::1'];
        this.ALLOWED_PORTS = [3000, 3001, 4000, 5000, 8000, 8080, 9000];
    }
    validateHostConfig(host) {
        if (!host)
            return false;
        if (this.ALLOWED_HOSTS.includes(host)) {
            return true;
        }
        if (host === '0.0.0.0' || host === '::' || host === '*') {
            return false;
        }
        const localIpRegex = /^192\.168\.\d+\.\d+$|^10\.\d+\.\d+\.\d+$|^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/;
        return localIpRegex.test(host);
    }
    validatePortConfig(port) {
        if (!port || port < 1024 || port > 65535)
            return false;
        if (this.ALLOWED_PORTS.includes(port)) {
            return true;
        }
        const dangerousPorts = [80, 443, 21, 22, 23, 25, 53, 110, 143, 993, 995];
        return !dangerousPorts.includes(port);
    }
    validateCorsConfig(cors) {
        if (cors === true) {
            return false;
        }
        if (typeof cors === 'string') {
            return cors !== '*';
        }
        if (Array.isArray(cors)) {
            return cors.every(origin => {
                try {
                    const url = new URL(origin);
                    return url.protocol === 'http:' || url.protocol === 'https:';
                }
                catch {
                    return false;
                }
            });
        }
        return false;
    }
    validateConfig(config) {
        const errors = [];
        if (config.host && !this.validateHostConfig(config.host)) {
            errors.push(`Insecure host configuration: ${config.host}`);
        }
        if (config.port && !this.validatePortConfig(config.port)) {
            errors.push(`Insecure port configuration: ${config.port}`);
        }
        if (config.cors !== undefined && !this.validateCorsConfig(config.cors)) {
            errors.push(`Insecure CORS configuration: ${JSON.stringify(config.cors)}`);
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}
exports.DevServerValidator = DevServerValidator;
//# sourceMappingURL=dev-server.validator.js.map