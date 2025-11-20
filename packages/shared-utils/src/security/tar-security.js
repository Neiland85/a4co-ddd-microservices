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
exports.tarSecurityMiddleware = exports.secureTarHandler = exports.TarSecurityMiddleware = exports.SecureTarHandler = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class SecureTarHandler {
    constructor() {
        this.allowedExtensions = ['.tar', '.tar.gz', '.tgz', '.tar.bz2', '.tar.xz'];
        this.maxFileSize = 100 * 1024 * 1024;
        this.maxPathLength = 260;
        this.dangerousPaths = [
            '/etc',
            '/usr',
            '/bin',
            '/sbin',
            '/boot',
            '/sys',
            '/proc',
            '/dev',
            '/root',
            '/home',
            'C:\\Windows',
            'C:\\Program Files',
            'C:\\System32',
            'C:\\Users',
            '..',
            '.env',
            '.git',
            'node_modules',
            'package.json',
            'yarn.lock',
            'pnpm-lock.yaml',
        ];
    }
    async validateTarFile(filePath) {
        const errors = [];
        const warnings = [];
        try {
            const ext = path.extname(filePath).toLowerCase();
            const baseName = path.basename(filePath).toLowerCase();
            if (!this.allowedExtensions.some(allowedExt => baseName.endsWith(allowedExt) || ext === allowedExt)) {
                errors.push(`Extensión de archivo no permitida: ${ext}`);
            }
            const stats = await fs_1.promises.stat(filePath);
            if (stats.size > this.maxFileSize) {
                errors.push(`Archivo demasiado grande: ${stats.size} bytes (máximo: ${this.maxFileSize})`);
            }
            const { stdout } = await execAsync(`tar -tf "${filePath}" 2>/dev/null | head -50`);
            const files = stdout.split('\n').filter(line => line.trim());
            for (const file of files) {
                if (file.length > this.maxPathLength) {
                    errors.push(`Path demasiado largo: ${file}`);
                    continue;
                }
                if (file.includes(' -> ')) {
                    const [linkPath, targetPath] = file.split(' -> ');
                    if (this.isDangerousPath(targetPath)) {
                        errors.push(`Symlink peligroso detectado: ${linkPath} -> ${targetPath}`);
                    }
                }
                if (path.isAbsolute(file)) {
                    warnings.push(`Path absoluto detectado: ${file}`);
                }
                if (file.includes('../') || file.startsWith('../')) {
                    errors.push(`Directory traversal detectado: ${file}`);
                }
                if (/[<>:"|?*\x00-\x1f]/.test(file)) {
                    errors.push(`Caracteres peligrosos en path: ${file}`);
                }
            }
        }
        catch (error) {
            errors.push(`Error al validar archivo tar: ${error instanceof Error ? error.message : String(error)}`);
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    async extractSecurely(tarPath, targetDir, options = {}) {
        const errors = [];
        const extractedFiles = [];
        try {
            const validation = await this.validateTarFile(tarPath);
            if (!validation.isValid) {
                return {
                    success: false,
                    extractedFiles: [],
                    errors: validation.errors,
                };
            }
            const safeTargetDir = options.createSandbox
                ? await this.createSandboxDirectory(targetDir)
                : targetDir;
            const extractCommand = this.buildSecureExtractCommand(tarPath, safeTargetDir, options);
            const { stdout, stderr } = await execAsync(extractCommand);
            if (stderr && !stderr.includes('tar: Removing leading')) {
                errors.push(`Errores durante extracción: ${stderr}`);
            }
            const { stdout: listOutput } = await execAsync(`find "${safeTargetDir}" -type f -newer "${tarPath}" 2>/dev/null | head -100`);
            extractedFiles.push(...listOutput.split('\n').filter(line => line.trim()));
            if (options.createSandbox && safeTargetDir !== targetDir) {
            }
        }
        catch (error) {
            errors.push(`Error durante extracción segura: ${error instanceof Error ? error.message : String(error)}`);
        }
        return {
            success: errors.length === 0,
            extractedFiles,
            errors,
        };
    }
    async createSandboxDirectory(baseDir) {
        const sandboxId = `sandbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const sandboxPath = path.join(baseDir, sandboxId);
        await fs_1.promises.mkdir(sandboxPath, { recursive: true });
        await fs_1.promises.writeFile(path.join(sandboxPath, '.sandbox_info'), JSON.stringify({
            created: new Date().toISOString(),
            purpose: 'Secure tar extraction sandbox',
            cleanup_after: 'manual_review',
        }, null, 2));
        return sandboxPath;
    }
    buildSecureExtractCommand(tarPath, targetDir, options) {
        const parts = ['tar'];
        parts.push('--no-same-owner');
        parts.push('--no-same-permissions');
        parts.push('--no-overwrite-dir');
        parts.push('--delay-directory-restore');
        parts.push('--no-dereference');
        parts.push('--no-recursion');
        parts.push('-xf', `"${tarPath}"`);
        parts.push('-C', `"${targetDir}"`);
        parts.push('--exclude-from=<(find /dev -type b -o -type c -o -type p 2>/dev/null)');
        return parts.join(' ');
    }
    isDangerousPath(filePath) {
        const normalizedPath = path.normalize(filePath).toLowerCase();
        return this.dangerousPaths.some(dangerous => normalizedPath.includes(dangerous.toLowerCase()) ||
            normalizedPath.startsWith(dangerous.toLowerCase()));
    }
    async validateChecksum(filePath, expectedChecksum, algorithm = 'sha256') {
        try {
            const { stdout } = await execAsync(`${algorithm}sum "${filePath}"`);
            const actualChecksum = stdout.split(' ')[0];
            return actualChecksum === expectedChecksum;
        }
        catch {
            return false;
        }
    }
    async monitorFileChanges(watchPaths, callback) {
        const fs = require('fs');
        const watchers = [];
        for (const watchPath of watchPaths) {
            try {
                const watcher = fs.watch(watchPath, (eventType, filename) => {
                    if (filename) {
                        callback([path.join(watchPath, filename)]);
                    }
                });
                watchers.push(watcher);
            }
            catch (error) {
                console.warn(`No se pudo monitorear ${watchPath}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        return () => {
            watchers.forEach(watcher => watcher.close());
        };
    }
}
exports.SecureTarHandler = SecureTarHandler;
class TarSecurityMiddleware {
    constructor() {
        this.secureHandler = new SecureTarHandler();
    }
    async beforeExtract(tarPath, targetDir) {
        const validation = await this.secureHandler.validateTarFile(tarPath);
        if (!validation.isValid) {
            throw new Error(`Archivo tar no seguro: ${validation.errors.join(', ')}`);
        }
        if (validation.warnings.length > 0) {
            console.warn('Advertencias de seguridad:', validation.warnings);
        }
    }
    async afterExtract(extractedFiles) {
        const dangerousFiles = extractedFiles.filter(file => this.isDangerousFile(file));
        if (dangerousFiles.length > 0) {
            console.error('Archivos peligrosos detectados después de extracción:', dangerousFiles);
        }
    }
    isDangerousFile(filePath) {
        const dangerousPatterns = [
            /\.env$/,
            /config.*\.json$/,
            /secrets?\.json$/,
            /private.*\.key$/,
            /.*\.pem$/,
        ];
        return dangerousPatterns.some(pattern => pattern.test(filePath));
    }
}
exports.TarSecurityMiddleware = TarSecurityMiddleware;
exports.secureTarHandler = new SecureTarHandler();
exports.tarSecurityMiddleware = new TarSecurityMiddleware();
//# sourceMappingURL=tar-security.js.map