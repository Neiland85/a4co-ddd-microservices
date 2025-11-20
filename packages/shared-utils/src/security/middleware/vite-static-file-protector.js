"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViteStaticFileProtector = void 0;
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
const vite_static_path_validator_1 = require("../validators/vite-static-path.validator");
class ViteStaticFileProtector {
    constructor(config = {}) {
        this.stats = {
            totalRequests: 0,
            blockedRequests: 0,
            allowedRequests: 0,
            sensitiveFileBlocks: 0,
            traversalAttempts: 0,
        };
        this.config = {
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
            ...config,
        };
    }
    async protect(request, context = 'vite-static') {
        this.stats.totalRequests++;
        if (request.method !== 'GET') {
            this.stats.allowedRequests++;
            return {
                allowed: true,
                validation: {
                    isValid: true,
                    riskLevel: 'low',
                    issues: [],
                    recommendations: [],
                    normalizedPath: request.url,
                    isSensitive: false,
                },
            };
        }
        const path = this.extractPathFromUrl(request.url);
        const validation = vite_static_path_validator_1.ViteStaticPathValidator.validatePath(path, this.config);
        if (!validation.isValid || validation.isSensitive) {
            this.stats.blockedRequests++;
            this.stats.lastBlockedPath = path;
            this.stats.lastBlockedTime = Date.now();
            if (validation.isSensitive) {
                this.stats.sensitiveFileBlocks++;
            }
            if (validation.issues.some(issue => issue.includes('directory traversal'))) {
                this.stats.traversalAttempts++;
            }
            logger.warn(`Blocked static file access attempt in ${context}`, {
                path,
                validation,
                userAgent: request.headers['user-agent'],
                referer: request.headers['referer'],
            });
            return {
                allowed: false,
                response: {
                    status: 403,
                    headers: {
                        'Content-Type': 'text/plain',
                        'X-Blocked-Reason': validation.issues[0] || 'Access denied',
                    },
                    body: 'Access denied',
                },
                validation,
            };
        }
        this.stats.allowedRequests++;
        if (validation.riskLevel === 'medium' || validation.riskLevel === 'high') {
            logger.info(`Allowed suspicious static file access in ${context}`, {
                path,
                riskLevel: validation.riskLevel,
                issues: validation.issues,
            });
        }
        return {
            allowed: true,
            validation,
        };
    }
    middleware() {
        return async (req, res, next) => {
            const result = await this.protect(req, 'vite-middleware');
            if (!result.allowed) {
                res.statusCode = result.response.status;
                Object.entries(result.response.headers).forEach(([key, value]) => {
                    res.setHeader(key, value);
                });
                res.end(result.response.body);
                return;
            }
            next();
        };
    }
    expressMiddleware() {
        return async (req, res, next) => {
            const request = {
                url: req.url,
                method: req.method,
                headers: req.headers,
            };
            const result = await this.protect(request, 'express-middleware');
            if (!result.allowed) {
                res.status(result.response.status);
                Object.entries(result.response.headers).forEach(([key, value]) => {
                    res.setHeader(key, value);
                });
                res.send(result.response.body);
                return;
            }
            next();
        };
    }
    getStats() {
        return { ...this.stats };
    }
    resetStats() {
        this.stats = {
            totalRequests: 0,
            blockedRequests: 0,
            allowedRequests: 0,
            sensitiveFileBlocks: 0,
            traversalAttempts: 0,
        };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    extractPathFromUrl(url) {
        try {
            const cleanUrl = url.split('?')[0].split('#')[0];
            return cleanUrl.replace(/^\/+/, '');
        }
        catch {
            return url;
        }
    }
}
exports.ViteStaticFileProtector = ViteStaticFileProtector;
//# sourceMappingURL=vite-static-file-protector.js.map