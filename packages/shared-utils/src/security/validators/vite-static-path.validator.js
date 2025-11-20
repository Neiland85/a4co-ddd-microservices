"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViteStaticPathValidator = void 0;
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
class ViteStaticPathValidator {
    static { this.DEFAULT_CONFIG = {
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
    }; }
    static validatePath(path, config = {}) {
        if (!path || typeof path !== 'string') {
            return {
                isValid: false,
                riskLevel: 'critical',
                issues: ['Path must be a non-empty string'],
                recommendations: ['Provide a valid file path'],
                normalizedPath: '',
                isSensitive: false,
            };
        }
        const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
        let decodedPath;
        try {
            decodedPath = decodeURIComponent(path);
        }
        catch (error) {
            decodedPath = path;
        }
        const normalizedPath = this.normalizePath(decodedPath);
        const issues = [];
        const recommendations = [];
        if (/%[0-9A-Fa-f]{2}/.test(path)) {
            issues.push('Path contains URL encoding which is not allowed for security');
            recommendations.push('Avoid URL encoding in static file paths');
        }
        if (this.hasDirectoryTraversal(path) || this.hasDirectoryTraversal(decodedPath)) {
            issues.push('Path contains directory traversal (..) which is not allowed');
            recommendations.push('Remove directory traversal from path');
        }
        if (this.isSensitiveDirectory(normalizedPath, fullConfig.sensitiveDirectories)) {
            issues.push('Path points to sensitive directory');
            recommendations.push('Restrict access to sensitive directories');
        }
        if (this.isSensitiveFile(normalizedPath, fullConfig.sensitiveFiles)) {
            issues.push('Path points to sensitive file');
            recommendations.push('Block access to sensitive files');
        }
        const extension = this.getFileExtension(normalizedPath);
        if (extension) {
            if (!fullConfig.allowHtmlFiles && extension === '.html') {
                issues.push('HTML files are not allowed to be served statically');
                recommendations.push('Disable HTML file serving or use proper routing');
            }
            if (!fullConfig.allowedExtensions.includes(extension.toLowerCase())) {
                issues.push(`File extension '${extension}' is not in allowed list`);
                recommendations.push('Add extension to allowed list or block the file');
            }
        }
        if (!fullConfig.allowDotFiles && this.isDotFile(normalizedPath)) {
            issues.push('Dot files are not allowed');
            recommendations.push('Block access to dot files or enable if necessary');
        }
        if (this.hasSuspiciousPatterns(normalizedPath)) {
            issues.push('Path contains suspicious patterns');
            recommendations.push('Review path for potential security issues');
        }
        const isSensitive = this.isSensitiveDirectory(normalizedPath, fullConfig.sensitiveDirectories) ||
            this.isSensitiveFile(normalizedPath, fullConfig.sensitiveFiles);
        const riskLevel = this.assessRiskLevel(issues, isSensitive);
        const isValid = riskLevel !== 'critical' && issues.length === 0;
        return {
            isValid,
            riskLevel,
            issues,
            recommendations,
            normalizedPath,
            isSensitive,
        };
    }
    static validatePaths(paths, config) {
        return paths.map(path => this.validatePath(path, config));
    }
    static sanitizePath(path) {
        if (!path)
            return path;
        try {
            let sanitized = decodeURIComponent(path);
            sanitized = sanitized.replace(/\\/g, '/');
            sanitized = sanitized.replace(/\/+/g, '/');
            sanitized = this.safeResolvePath(sanitized);
            if (!sanitized.startsWith('/')) {
                sanitized = '/' + sanitized;
            }
            return sanitized;
        }
        catch (error) {
            let sanitized = path.replace(/\\/g, '/').replace(/\/+/g, '/');
            sanitized = this.safeResolvePath(sanitized);
            if (!sanitized.startsWith('/')) {
                sanitized = '/' + sanitized;
            }
            return sanitized;
        }
    }
    static safeResolvePath(path) {
        const isAbsolute = path.startsWith('/');
        const parts = path.split('/').filter(p => p !== '');
        const resolved = [];
        for (const part of parts) {
            if (part === '..') {
                if (resolved.length > 0) {
                    resolved.pop();
                }
            }
            else if (part !== '.') {
                resolved.push(part);
            }
        }
        const result = resolved.join('/');
        return isAbsolute ? '/' + result : result;
    }
    static resolvePath(path) {
        const parts = path.split('/').filter(p => p && p !== '.');
        const resolved = [];
        for (const part of parts) {
            if (part === '..') {
                if (resolved.length > 0) {
                    resolved.pop();
                }
            }
            else {
                resolved.push(part);
            }
        }
        return resolved.join('/');
    }
    static shouldBlockPath(path, config) {
        const result = this.validatePath(path, config);
        return !result.isValid || result.isSensitive;
    }
    static normalizePath(path) {
        return path.replace(/\\/g, '/').replace(/^\/+/, '');
    }
    static hasDirectoryTraversal(path) {
        if (path.includes('..') || path.includes('\\..') || path.includes('../')) {
            return true;
        }
        try {
            const decoded = decodeURIComponent(path);
            if (decoded.includes('..') || decoded.includes('../')) {
                return true;
            }
        }
        catch (error) {
        }
        if (/%2e%2e/i.test(path) || /%2e%2e%2f/i.test(path) || /%5c%2e%2e/i.test(path)) {
            return true;
        }
        return false;
    }
    static isSensitiveDirectory(path, sensitiveDirs) {
        const pathParts = path.split('/').filter(p => p);
        return pathParts.some(part => sensitiveDirs.includes(part));
    }
    static isSensitiveFile(path, sensitiveFiles) {
        const filename = path.split('/').pop() || '';
        return sensitiveFiles.some(sensitive => filename.includes(sensitive));
    }
    static getFileExtension(path) {
        const match = path.match(/\.([a-zA-Z0-9]+)$/);
        return match ? `.${match[1]}` : null;
    }
    static isDotFile(path) {
        const filename = path.split('/').pop() || '';
        return filename.startsWith('.');
    }
    static hasSuspiciousPatterns(path) {
        const suspiciousPatterns = [
            /\0/,
            /[<>\"'|?*]/,
            /\/\/+/,
            /\.{3,}/,
        ];
        return suspiciousPatterns.some(pattern => pattern.test(path));
    }
    static assessRiskLevel(issues, isSensitive) {
        if (isSensitive)
            return 'critical';
        if (issues.some(issue => issue.includes('directory traversal')))
            return 'critical';
        if (issues.some(issue => issue.includes('sensitive')))
            return 'high';
        if (issues.some(issue => issue.includes('HTML files') || issue.includes('dot files')))
            return 'medium';
        return issues.length > 0 ? 'low' : 'low';
    }
}
exports.ViteStaticPathValidator = ViteStaticPathValidator;
//# sourceMappingURL=vite-static-path.validator.js.map