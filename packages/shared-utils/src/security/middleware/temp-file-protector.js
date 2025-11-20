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
exports.TempFileProtector = void 0;
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
const temp_file_validator_1 = require("../validators/temp-file.validator");
class TempFileProtector {
    constructor(config = {}) {
        const defaultConfig = temp_file_validator_1.TempFileValidator['DEFAULT_CONFIG'];
        const mergedAllowedTempDirs = config.allowedTempDirs
            ? [...new Set([...defaultConfig.allowedTempDirs, ...config.allowedTempDirs])]
            : defaultConfig.allowedTempDirs;
        this.config = { ...defaultConfig, ...config, allowedTempDirs: mergedAllowedTempDirs };
        this.stats = {
            totalOperations: 0,
            blockedOperations: 0,
            symlinkAttempts: 0,
            invalidPathAttempts: 0,
        };
    }
    protect(operation, filePath, context = 'temp-file') {
        this.stats.totalOperations++;
        const validation = temp_file_validator_1.TempFileValidator.validateTempPath(filePath, this.config);
        if (!validation.isValid) {
            this.stats.blockedOperations++;
            this.stats.invalidPathAttempts++;
            if (validation.isSymlink) {
                this.stats.symlinkAttempts++;
            }
            this.stats.lastBlockedOperation = {
                path: filePath,
                reason: validation.issues.join(', '),
                timestamp: new Date(),
            };
            logger.warn(`Blocked temp file operation in ${context}`, {
                operation,
                path: filePath,
                validation,
                userAgent: this.getUserAgent(),
                pid: process.pid,
            });
            return false;
        }
        logger.info(`Allowed temp file operation in ${context}`, {
            operation,
            path: filePath,
            normalizedPath: validation.normalizedPath,
        });
        return true;
    }
    async createProtectedTempDir(prefix = 'app-', context = 'temp-file') {
        const os = require('os');
        const crypto = require('crypto');
        const randomBytes = crypto.randomBytes(8).toString('hex');
        const dirName = `${prefix}${randomBytes}`;
        const tempDir = path.join(os.tmpdir(), dirName);
        try {
            fs.mkdirSync(tempDir, { mode: 0o700 });
            if (!this.protect('createTempDir', tempDir, context)) {
                try {
                    fs.rmdirSync(tempDir);
                }
                catch (cleanupError) {
                    logger.error('Failed to cleanup invalid temp directory', {
                        path: tempDir,
                        error: cleanupError,
                    });
                }
                throw new Error('Created temp directory failed security validation');
            }
            return tempDir;
        }
        catch (error) {
            logger.error('Failed to create protected temp directory', { error, prefix });
            throw error;
        }
    }
    async createProtectedTempFile(prefix = 'app-', suffix = '', context = 'temp-file') {
        const crypto = require('crypto');
        const tempDir = await this.createProtectedTempDir(prefix, context);
        const randomBytes = crypto.randomBytes(8).toString('hex');
        const fileName = `${prefix}${randomBytes}${suffix}`;
        const filePath = path.join(tempDir, fileName);
        try {
            fs.writeFileSync(filePath, '');
            if (!this.protect('createTempFile', filePath, context)) {
                try {
                    fs.unlinkSync(filePath);
                    fs.rmdirSync(tempDir);
                }
                catch (cleanupError) {
                    logger.error('Failed to cleanup invalid temp file', {
                        path: filePath,
                        error: cleanupError,
                    });
                }
                throw new Error('Created temp file failed security validation');
            }
            return filePath;
        }
        catch (error) {
            logger.error('Failed to create protected temp file', { error, tempDir, fileName });
            throw error;
        }
    }
    getStats() {
        return { ...this.stats };
    }
    resetStats() {
        this.stats = {
            totalOperations: 0,
            blockedOperations: 0,
            symlinkAttempts: 0,
            invalidPathAttempts: 0,
        };
    }
    getUserAgent() {
        return undefined;
    }
}
exports.TempFileProtector = TempFileProtector;
//# sourceMappingURL=temp-file-protector.js.map