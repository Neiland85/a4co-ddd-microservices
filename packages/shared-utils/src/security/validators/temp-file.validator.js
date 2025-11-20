"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempFileValidator = void 0;
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class TempFileValidator {
    static { this.DEFAULT_CONFIG = {
        allowedTempDirs: ['/tmp', '/var/tmp', '/dev/shm', '/private/tmp', '/var/folders'],
        maxTempFileSize: 100 * 1024 * 1024,
        allowSymlinks: false,
        validateParentDirs: true,
    }; }
    static validateTempPath(filePath, config = {}) {
        if (!filePath || typeof filePath !== 'string') {
            return {
                isValid: false,
                riskLevel: 'critical',
                issues: ['File path must be a non-empty string'],
                recommendations: ['Provide a valid file path'],
                normalizedPath: '',
                isSymlink: false,
            };
        }
        const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
        const normalizedPath = path.resolve(filePath);
        const issues = [];
        const recommendations = [];
        const isInAllowedTempDir = fullConfig.allowedTempDirs.some(tempDir => {
            try {
                const resolvedTempDir = fs.realpathSync(path.resolve(tempDir));
                if (fs.existsSync(normalizedPath)) {
                    const resolvedPath = fs.realpathSync(normalizedPath);
                    return resolvedPath.startsWith(resolvedTempDir);
                }
                else {
                    return (normalizedPath.startsWith(path.resolve(tempDir)) ||
                        normalizedPath.startsWith(resolvedTempDir));
                }
            }
            catch {
                return normalizedPath.startsWith(path.resolve(tempDir));
            }
        });
        if (!isInAllowedTempDir) {
            issues.push('File path is not in allowed temporary directories');
            recommendations.push('Use paths within allowed temporary directories only');
        }
        let isSymlink = false;
        let targetPath;
        try {
            const stats = fs.lstatSync(filePath);
            isSymlink = stats.isSymbolicLink();
            if (isSymlink) {
                if (!fullConfig.allowSymlinks) {
                    issues.push('Symbolic links are not allowed in temporary file operations');
                    recommendations.push('Avoid using symbolic links in temp file operations');
                }
                try {
                    targetPath = fs.readlinkSync(filePath);
                    const resolvedTarget = fs.realpathSync(path.resolve(path.dirname(filePath), targetPath));
                    const isTargetAllowed = fullConfig.allowedTempDirs.some(tempDir => {
                        try {
                            const resolvedTempDir = fs.realpathSync(path.resolve(tempDir));
                            return resolvedTarget.startsWith(resolvedTempDir);
                        }
                        catch {
                            return resolvedTarget.startsWith(path.resolve(tempDir));
                        }
                    });
                    if (!isTargetAllowed) {
                        issues.push('Symbolic link points outside allowed temporary directories');
                        recommendations.push('Ensure symlinks point within allowed temp directories');
                    }
                }
                catch (error) {
                    issues.push('Cannot resolve symbolic link target');
                    recommendations.push('Verify symlink integrity before use');
                }
            }
        }
        catch (error) {
        }
        if (fullConfig.validateParentDirs) {
            const parentDir = path.dirname(normalizedPath);
            try {
                const parentStats = fs.lstatSync(parentDir);
                if (parentStats.isSymbolicLink()) {
                    try {
                        const parentTarget = fs.readlinkSync(parentDir);
                        const resolvedParentTarget = fs.realpathSync(path.resolve(path.dirname(parentDir), parentTarget));
                        const isParentTargetAllowed = fullConfig.allowedTempDirs.some(tempDir => {
                            try {
                                const resolvedTempDir = fs.realpathSync(path.resolve(tempDir));
                                return (resolvedParentTarget === resolvedTempDir ||
                                    resolvedParentTarget.startsWith(resolvedTempDir) ||
                                    resolvedTempDir.startsWith(resolvedParentTarget));
                            }
                            catch {
                                return (resolvedParentTarget === path.resolve(tempDir) ||
                                    resolvedParentTarget.startsWith(path.resolve(tempDir)));
                            }
                        });
                        if (!isParentTargetAllowed) {
                            issues.push('Parent directory is a symbolic link pointing outside allowed areas');
                            recommendations.push('Avoid creating files in symlinked directories pointing outside temp areas');
                        }
                    }
                    catch (linkError) {
                        issues.push('Cannot resolve parent directory symlink target');
                        recommendations.push('Verify parent directory symlink integrity');
                    }
                }
            }
            catch (error) {
                issues.push('Cannot access parent directory');
                recommendations.push('Ensure parent directory exists and is accessible');
            }
        }
        if (this.hasSuspiciousPatterns(normalizedPath)) {
            issues.push('Path contains suspicious patterns');
            recommendations.push('Review path for potential security issues');
        }
        const riskLevel = this.assessRiskLevel(issues, isSymlink);
        const isValid = riskLevel !== 'critical' && issues.length === 0;
        return {
            isValid,
            riskLevel,
            issues,
            recommendations,
            normalizedPath,
            isSymlink,
            targetPath,
        };
    }
    static validateTempPaths(paths, config) {
        return paths.map(path => this.validateTempPath(path, config));
    }
    static shouldBlockTempOperation(filePath, config) {
        const result = this.validateTempPath(filePath, config);
        return !result.isValid || result.isSymlink;
    }
    static sanitizeTempPath(filePath) {
        if (!filePath)
            return filePath;
        if (filePath.startsWith('./tmp/') || filePath.startsWith('tmp/')) {
            return path.join('/tmp', filePath.replace(/^\.?\.?\/?tmp\//, ''));
        }
        const resolved = path.resolve(filePath);
        return resolved;
    }
    static hasSuspiciousPatterns(path) {
        const suspiciousPatterns = [
            / /,
            /[<>"'|?*]/,
            /\/[\/]+/,
            /[.]{3,}/,
        ];
        return suspiciousPatterns.some(pattern => pattern.test(path));
    }
    static assessRiskLevel(issues, isSymlink) {
        if (isSymlink)
            return 'high';
        if (issues.some(issue => issue.includes('not in allowed')))
            return 'critical';
        if (issues.some(issue => issue.includes('symlink')))
            return 'high';
        if (issues.some(issue => issue.includes('parent directory')))
            return 'medium';
        return issues.length > 0 ? 'low' : 'low';
    }
}
exports.TempFileValidator = TempFileValidator;
//# sourceMappingURL=temp-file.validator.js.map