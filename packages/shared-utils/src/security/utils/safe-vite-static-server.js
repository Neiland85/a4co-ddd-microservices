"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeViteStaticServer = void 0;
exports.createSafeViteStaticServer = createSafeViteStaticServer;
exports.createSecureVitePlugin = createSecureVitePlugin;
exports.createSecureExpressMiddleware = createSecureExpressMiddleware;
let logger;
try {
    const observability = require('@a4co/observability');
    logger = observability.getGlobalLogger();
}
catch {
    logger = {
        info: console.info,
        warn: console.warn,
        error: console.error,
    };
}
const vite_static_file_protector_1 = require("../middleware/vite-static-file-protector");
const vite_static_path_validator_1 = require("../validators/vite-static-path.validator");
class SafeViteStaticServer {
    constructor(options = {}) {
        this.options = {
            root: process.cwd(),
            enableProtection: true,
            logAccess: true,
            allowedExtensions: [
                '.js',
                '.css',
                '.png',
                '.jpg',
                '.jpeg',
                '.gif',
                '.svg',
                '.ico',
                '.woff',
                '.woff2',
                '.ttf',
                '.eot',
            ],
            sensitiveDirectories: [
                'node_modules',
                '.git',
                '.env',
                'dist',
                'build',
                'coverage',
                'logs',
                'tmp',
                'temp',
            ],
            sensitiveFiles: [
                '.env',
                '.env.local',
                '.env.production',
                'package.json',
                'yarn.lock',
                'pnpm-lock.yaml',
                'webpack.config.js',
            ],
            allowHtmlFiles: false,
            allowDotFiles: false,
            ...options,
        };
        this.root = this.options.root;
        this.protector = new vite_static_file_protector_1.ViteStaticFileProtector(this.options);
    }
    async serveFile(url, method = 'GET', headers = {}) {
        if (!this.options.enableProtection) {
            return {
                allowed: true,
                path: this.resolvePath(url),
            };
        }
        const request = { url, method, headers };
        const result = await this.protector.protect(request, 'safe-server');
        if (!result.allowed) {
            if (this.options.logAccess) {
                logger.warn('Static file access blocked', {
                    url,
                    reason: result.validation.issues[0],
                    riskLevel: result.validation.riskLevel,
                });
            }
            return {
                allowed: false,
                error: 'Access denied',
                blockedReason: result.validation.issues[0],
            };
        }
        const resolvedPath = this.resolvePath(url);
        if (this.options.customValidator && !this.options.customValidator(resolvedPath)) {
            return {
                allowed: false,
                error: 'Custom validation failed',
                blockedReason: 'Custom validator rejected the path',
            };
        }
        if (this.options.logAccess) {
            logger.info('Static file served', {
                url,
                path: resolvedPath,
                riskLevel: result.validation.riskLevel,
            });
        }
        return {
            allowed: true,
            path: resolvedPath,
        };
    }
    isPathSafe(path) {
        return !vite_static_path_validator_1.ViteStaticPathValidator.shouldBlockPath(path, this.options);
    }
    validatePath(path) {
        return vite_static_path_validator_1.ViteStaticPathValidator.validatePath(path, this.options);
    }
    getViteConfig() {
        return {
            server: {
                fs: {
                    strict: true,
                    allow: [this.root],
                    deny: this.options.sensitiveDirectories,
                },
                middlewareMode: false,
            },
            build: {
                rollupOptions: {
                    external: this.options.sensitiveFiles,
                },
            },
        };
    }
    createExpressMiddleware() {
        return this.protector.expressMiddleware();
    }
    createVitePlugin() {
        const self = this;
        return {
            name: 'vite-static-security',
            configureServer(server) {
                server.middlewares.use(self.protector.middleware());
            },
            config() {
                return self.getViteConfig();
            },
        };
    }
    getStats() {
        return this.protector.getStats();
    }
    updateConfig(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.protector.updateConfig(newOptions);
    }
    resolvePath(url) {
        const cleanUrl = url.split('?')[0].split('#')[0];
        const relativePath = decodeURIComponent(cleanUrl.replace(/^\/+/, ''));
        return require('path').resolve(this.root, relativePath);
    }
}
exports.SafeViteStaticServer = SafeViteStaticServer;
function createSafeViteStaticServer(options) {
    return new SafeViteStaticServer(options);
}
function createSecureVitePlugin(options) {
    const server = new SafeViteStaticServer(options);
    return server.createVitePlugin();
}
function createSecureExpressMiddleware(options) {
    const server = new SafeViteStaticServer(options);
    return server.createExpressMiddleware();
}
//# sourceMappingURL=safe-vite-static-server.js.map