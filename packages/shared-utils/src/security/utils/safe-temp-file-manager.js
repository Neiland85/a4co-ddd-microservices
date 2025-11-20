"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeTempFileManager = void 0;
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
const temp_file_protector_1 = require("../middleware/temp-file-protector");
const temp_file_validator_1 = require("../validators/temp-file.validator");
class SafeTempFileManager {
    constructor(config = {}) {
        this.activeFiles = new Set();
        this.activeDirs = new Set();
        this.config = { ...temp_file_validator_1.TempFileValidator['DEFAULT_CONFIG'], ...config };
        this.protector = new temp_file_protector_1.TempFileProtector(this.config);
    }
    async createTempDir(options = {}) {
        const { prefix = 'safe-', autoCleanup = true } = options;
        try {
            const tempDir = await this.protector.createProtectedTempDir(prefix, 'safe-temp-manager');
            if (autoCleanup) {
                this.activeDirs.add(tempDir);
                this.setupCleanupHandlers(tempDir, 'directory');
            }
            logger.info('Created safe temp directory', { path: tempDir, prefix });
            return tempDir;
        }
        catch (error) {
            logger.error('Failed to create safe temp directory', { error, prefix });
            throw error;
        }
    }
    async createTempFile(options = {}) {
        const { prefix = 'safe-', suffix = '', mode, autoCleanup = true } = options;
        try {
            const tempFile = await this.protector.createProtectedTempFile(prefix, suffix, 'safe-temp-manager');
            if (mode !== undefined) {
                require('fs').chmodSync(tempFile, mode);
            }
            if (autoCleanup) {
                this.activeFiles.add(tempFile);
                this.setupCleanupHandlers(tempFile, 'file');
            }
            logger.info('Created safe temp file', { path: tempFile, prefix, suffix });
            return tempFile;
        }
        catch (error) {
            logger.error('Failed to create safe temp file', { error, prefix, suffix });
            throw error;
        }
    }
    async writeTempFile(filePath, data, options = {}) {
        const { maxSize = this.config.maxTempFileSize } = options;
        if (!this.protector.protect('writeTempFile', filePath, 'safe-temp-manager')) {
            throw new Error(`Temp file write blocked: ${filePath}`);
        }
        const dataSize = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data, 'utf8');
        if (dataSize > maxSize) {
            throw new Error(`Data size (${dataSize}) exceeds maximum allowed size (${maxSize})`);
        }
        try {
            require('fs').writeFileSync(filePath, data);
            logger.info('Successfully wrote to temp file', { path: filePath, size: dataSize });
        }
        catch (error) {
            logger.error('Failed to write temp file', { path: filePath, error });
            throw error;
        }
    }
    async readTempFile(filePath) {
        if (!this.protector.protect('readTempFile', filePath, 'safe-temp-manager')) {
            throw new Error(`Temp file read blocked: ${filePath}`);
        }
        try {
            const data = require('fs').readFileSync(filePath);
            logger.info('Successfully read from temp file', { path: filePath, size: data.length });
            return data;
        }
        catch (error) {
            logger.error('Failed to read temp file', { path: filePath, error });
            throw error;
        }
    }
    async removeTempPath(filePath) {
        try {
            const stats = require('fs').statSync(filePath);
            if (stats.isDirectory()) {
                require('fs').rmdirSync(filePath);
                this.activeDirs.delete(filePath);
                logger.info('Removed temp directory', { path: filePath });
            }
            else {
                require('fs').unlinkSync(filePath);
                this.activeFiles.delete(filePath);
                logger.info('Removed temp file', { path: filePath });
            }
        }
        catch (error) {
            logger.error('Failed to remove temp path', { path: filePath, error });
            throw error;
        }
    }
    async cleanup() {
        const errors = [];
        for (const filePath of this.activeFiles) {
            try {
                await this.removeTempPath(filePath);
            }
            catch (error) {
                errors.push(error);
            }
        }
        for (const dirPath of this.activeDirs) {
            try {
                await this.removeTempPath(dirPath);
            }
            catch (error) {
                errors.push(error);
            }
        }
        this.activeFiles.clear();
        this.activeDirs.clear();
        if (errors.length > 0) {
            logger.warn('Some temp files failed to cleanup', { errorCount: errors.length });
            throw new Error(`Cleanup failed for ${errors.length} items`);
        }
        logger.info('Temp file cleanup completed');
    }
    getStats() {
        return this.protector.getStats();
    }
    setupCleanupHandlers(path, type) {
        const cleanup = () => {
            try {
                if (type === 'file') {
                    require('fs').unlinkSync(path);
                }
                else {
                    require('fs').rmdirSync(path);
                }
            }
            catch (error) {
            }
        };
        process.on('exit', cleanup);
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        process.on('uncaughtException', cleanup);
    }
}
exports.SafeTempFileManager = SafeTempFileManager;
//# sourceMappingURL=safe-temp-file-manager.js.map