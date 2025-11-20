"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevServerProtector = void 0;
const dev_server_validator_1 = require("../validators/dev-server.validator");
class DevServerProtector {
    constructor() {
        this.validator = new dev_server_validator_1.DevServerValidator();
    }
    createExpressMiddleware() {
        return (req, res, next) => {
            const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
            const hostname = req.hostname || req.headers['host'] || '';
            if (this.isSuspiciousRequest(clientIp, hostname)) {
                console.warn(`[DEV SERVER SECURITY] Suspicious request blocked: ${req.method} ${req.url} from ${clientIp}`);
                res.status(403).send('Access denied');
                return;
            }
            this.addSecurityHeaders(res.setHeader.bind(res));
            next();
        };
    }
    createKoaMiddleware() {
        return async (ctx, next) => {
            const clientIp = ctx.ip || ctx.headers['x-forwarded-for'] || 'unknown';
            const hostname = ctx.hostname || ctx.headers['host'] || '';
            if (this.isSuspiciousRequest(clientIp, hostname)) {
                console.warn(`[DEV SERVER SECURITY] Suspicious request blocked: ${ctx.method} ${ctx.url} from ${clientIp}`);
                ctx.status = 403;
                ctx.body = 'Access denied';
                return;
            }
            this.addSecurityHeaders(ctx.set.bind(ctx));
            await next();
        };
    }
    createVitePlugin() {
        return {
            name: 'vite-plugin-dev-server-security',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    const protector = new DevServerProtector();
                    const clientIp = req.socket?.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
                    const hostname = req.headers.host || '';
                    if (protector.isSuspiciousRequest(clientIp, hostname)) {
                        console.warn(`[VITE DEV SERVER SECURITY] Suspicious request blocked: ${req.method} ${req.url} from ${clientIp}`);
                        res.statusCode = 403;
                        res.end('Access denied');
                        return;
                    }
                    protector.addSecurityHeaders((key, value) => {
                        res.setHeader(key, value);
                    });
                    next();
                });
            },
        };
    }
    isSuspiciousRequest(clientIp, hostname) {
        if (this.isExternalIp(clientIp)) {
            return true;
        }
        if (hostname && !this.validator.validateHostConfig(hostname.split(':')[0])) {
            return true;
        }
        return false;
    }
    isExternalIp(ip) {
        if (!ip || ip === 'unknown')
            return false;
        const localhostIps = ['127.0.0.1', '::1', 'localhost', '::ffff:127.0.0.1'];
        if (localhostIps.includes(ip)) {
            return false;
        }
        const localRanges = [/^192\.168\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./];
        return !localRanges.some(range => range.test(ip));
    }
    addSecurityHeaders(setHeader) {
        const headers = {
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            'Referrer-Policy': 'strict-origin-when-cross-origin',
        };
        Object.entries(headers).forEach(([key, value]) => {
            setHeader(key, value);
        });
    }
}
exports.DevServerProtector = DevServerProtector;
//# sourceMappingURL=dev-server-protector.js.map