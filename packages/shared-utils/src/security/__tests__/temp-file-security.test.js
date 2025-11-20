"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const temp_file_protector_1 = require("../middleware/temp-file-protector");
const safe_temp_file_manager_1 = require("../utils/safe-temp-file-manager");
const temp_file_validator_1 = require("../validators/temp-file.validator");
describe('TempFileValidator', () => {
    const config = {
        allowedTempDirs: ['/tmp', '/var/tmp'],
        allowSymlinks: false,
        validateParentDirs: true,
    };
    describe('validateTempPath', () => {
        it('should allow safe temp paths', () => {
            const result = temp_file_validator_1.TempFileValidator.validateTempPath('/tmp/safe-file.txt', config);
            expect(result.isValid).toBe(true);
            expect(result.riskLevel).toBe('low');
            expect(result.isSymlink).toBe(false);
        });
        it('should block paths outside allowed temp directories', () => {
            const result = temp_file_validator_1.TempFileValidator.validateTempPath('/etc/passwd', config);
            expect(result.isValid).toBe(false);
            expect(result.riskLevel).toBe('critical');
            expect(result.issues).toContain('File path is not in allowed temporary directories');
        });
        it('should detect and block symlinks', () => {
            const fs = require('fs');
            const path = require('path');
            const testDir = path.join(require('os').tmpdir(), 'test-symlink-dir');
            const targetFile = path.join(testDir, 'target.txt');
            const symlinkFile = path.join(testDir, 'symlink.txt');
            try {
                fs.mkdirSync(testDir, { recursive: true });
                fs.writeFileSync(targetFile, 'test');
                fs.symlinkSync(targetFile, symlinkFile);
                const result = temp_file_validator_1.TempFileValidator.validateTempPath(symlinkFile, config);
                expect(result.isValid).toBe(false);
                expect(result.isSymlink).toBe(true);
                expect(result.issues).toContain('Symbolic links are not allowed in temporary file operations');
            }
            finally {
                try {
                    fs.unlinkSync(symlinkFile);
                    fs.unlinkSync(targetFile);
                    fs.rmdirSync(testDir);
                }
                catch (e) {
                }
            }
        });
        it('should validate parent directories', () => {
            const result = temp_file_validator_1.TempFileValidator.validateTempPath('/tmp/nonexistent-parent/child.txt', {
                ...config,
                validateParentDirs: true,
            });
            expect(result.isValid).toBe(false);
            expect(result.issues).toContain('Cannot access parent directory');
        });
    });
    describe('validateTempPaths', () => {
        it('should validate multiple paths', () => {
            const paths = ['/tmp/safe.txt', '/etc/passwd', '/tmp/another.txt'];
            const results = temp_file_validator_1.TempFileValidator.validateTempPaths(paths, config);
            expect(results).toHaveLength(3);
            expect(results[0].isValid).toBe(true);
            expect(results[1].isValid).toBe(false);
            expect(results[2].isValid).toBe(true);
        });
    });
    describe('sanitizeTempPath', () => {
        it('should normalize temp paths', () => {
            expect(temp_file_validator_1.TempFileValidator.sanitizeTempPath('/tmp/../tmp/safe.txt')).toBe('/tmp/safe.txt');
            expect(temp_file_validator_1.TempFileValidator.sanitizeTempPath('./tmp/file.txt')).toBe('/tmp/file.txt');
        });
    });
});
describe('TempFileProtector', () => {
    let protector;
    beforeEach(() => {
        protector = new temp_file_protector_1.TempFileProtector({
            allowedTempDirs: ['/tmp', '/var/tmp'],
            allowSymlinks: false,
        });
    });
    describe('protect', () => {
        it('should allow safe operations', () => {
            const result = protector.protect('read', '/tmp/safe-file.txt');
            expect(result).toBe(true);
        });
        it('should block unsafe operations', () => {
            const result = protector.protect('write', '/etc/passwd');
            expect(result).toBe(false);
        });
    });
    describe('createProtectedTempDir', () => {
        it('should create protected temp directory', async () => {
            const tempDir = await protector.createProtectedTempDir('test-');
            expect(tempDir).toContain('test-');
            const os = require('os');
            const isInValidTempDir = tempDir.startsWith('/tmp/') ||
                tempDir.startsWith(os.tmpdir()) ||
                tempDir.startsWith('/var/tmp/') ||
                tempDir.startsWith('/private/tmp/');
            expect(isInValidTempDir).toBe(true);
            require('fs').rmdirSync(tempDir);
        });
    });
    describe('createProtectedTempFile', () => {
        it('should create protected temp file', async () => {
            const tempFile = await protector.createProtectedTempFile('test-', '.txt');
            expect(tempFile).toContain('test-');
            expect(tempFile.endsWith('.txt')).toBe(true);
            const fs = require('fs');
            const path = require('path');
            fs.unlinkSync(tempFile);
            fs.rmdirSync(path.dirname(tempFile));
        });
    });
    describe('getStats', () => {
        it('should return protection statistics', () => {
            protector.protect('read', '/tmp/safe.txt');
            protector.protect('write', '/etc/passwd');
            const stats = protector.getStats();
            expect(stats.totalOperations).toBe(2);
            expect(stats.blockedOperations).toBe(1);
        });
    });
});
describe('SafeTempFileManager', () => {
    let manager;
    beforeEach(() => {
        manager = new safe_temp_file_manager_1.SafeTempFileManager({
            allowedTempDirs: ['/tmp', '/var/tmp'],
            allowSymlinks: false,
        });
    });
    describe('createTempDir', () => {
        it('should create safe temp directory', async () => {
            const tempDir = await manager.createTempDir({ prefix: 'test-' });
            expect(tempDir).toContain('test-');
            const os = require('os');
            const isInValidTempDir = tempDir.startsWith('/tmp/') ||
                tempDir.startsWith(os.tmpdir()) ||
                tempDir.startsWith('/var/tmp/') ||
                tempDir.startsWith('/private/tmp/');
            expect(isInValidTempDir).toBe(true);
            const fs = require('fs');
            expect(fs.existsSync(tempDir)).toBe(true);
            expect(fs.statSync(tempDir).isDirectory()).toBe(true);
        });
    });
    describe('createTempFile', () => {
        it('should create safe temp file', async () => {
            const tempFile = await manager.createTempFile({ prefix: 'test-', suffix: '.txt' });
            expect(tempFile.includes('test-')).toBe(true);
            expect(tempFile.endsWith('.txt')).toBe(true);
            const fs = require('fs');
            expect(fs.existsSync(tempFile)).toBe(true);
            expect(fs.statSync(tempFile).isFile()).toBe(true);
        });
    });
    describe('writeTempFile and readTempFile', () => {
        it('should safely write and read temp files', async () => {
            const tempFile = await manager.createTempFile();
            const testData = 'Hello, secure temp file!';
            await manager.writeTempFile(tempFile, testData);
            const readData = await manager.readTempFile(tempFile);
            expect(readData.toString()).toBe(testData);
        });
        it('should enforce size limits', async () => {
            const tempFile = await manager.createTempFile();
            const largeData = Buffer.alloc(1024 * 1024);
            await expect(manager.writeTempFile(tempFile, largeData, { maxSize: 1024 })).rejects.toThrow();
        });
    });
    describe('cleanup', () => {
        it('should cleanup all temp files and directories', async () => {
            const tempFile = await manager.createTempFile();
            const tempDir = await manager.createTempDir();
            const fs = require('fs');
            expect(fs.existsSync(tempFile)).toBe(true);
            expect(fs.existsSync(tempDir)).toBe(true);
            await manager.cleanup();
            expect(fs.existsSync(tempFile)).toBe(false);
            expect(fs.existsSync(tempDir)).toBe(false);
        });
    });
});
//# sourceMappingURL=temp-file-security.test.js.map