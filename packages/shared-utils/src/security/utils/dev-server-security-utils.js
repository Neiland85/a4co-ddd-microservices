"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevServerSecurityUtils = void 0;
class DevServerSecurityUtils {
    generateSecureViteConfig() {
        return {
            server: {
                host: 'localhost',
                port: 3000,
                cors: {
                    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
                    credentials: false,
                },
                headers: this.generateSecureHeaders(),
            },
        };
    }
    generateSecureNextConfig() {
        return {
            headers: () => [
                {
                    source: '/(.*)',
                    headers: Object.entries(this.generateSecureHeaders()).map(([key, value]) => ({
                        key,
                        value,
                    })),
                },
            ],
        };
    }
    generateSecureEsbuildConfig() {
        return {
            host: 'localhost',
            port: 3000,
            servedir: './dist',
            onRequest: (args) => {
                console.log(`[${new Date().toISOString()}] ${args.method} ${args.path} from ${args.remoteAddress}`);
            },
        };
    }
    generateSecureHeaders() {
        return {
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'",
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        };
    }
    generateSecureEnvVars() {
        return {
            NODE_ENV: 'development',
            HOST: 'localhost',
            PORT: '3000',
            CORS_ORIGIN: 'http://localhost:3000',
            SECURE_HEADERS: 'true',
        };
    }
    sanitizeHost(host) {
        const allowedHosts = ['localhost', '127.0.0.1', '::1'];
        if (allowedHosts.includes(host)) {
            return host;
        }
        return 'localhost';
    }
    sanitizePort(port) {
        const allowedPorts = [3000, 3001, 4000, 5000, 8000, 8080, 9000];
        if (allowedPorts.includes(port)) {
            return port;
        }
        return 3000;
    }
}
exports.DevServerSecurityUtils = DevServerSecurityUtils;
//# sourceMappingURL=dev-server-security-utils.js.map