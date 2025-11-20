"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_static_file_protector_1 = require("../middleware/vite-static-file-protector");
const safe_vite_static_server_1 = require("../utils/safe-vite-static-server");
const vite_static_path_validator_1 = require("../validators/vite-static-path.validator");
describe('ViteStaticPathValidator', () => {
    const config = {
        allowedExtensions: ['.js', '.css', '.png', '.jpg', '.svg'],
        sensitiveDirectories: ['node_modules', '.git', '.env'],
        sensitiveFiles: ['package.json', '.env.local', 'config.json'],
    };
    describe('validatePath', () => {
        it('should allow safe paths', () => {
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('public/assets/app.js', config).isValid).toBe(true);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('public/images/logo.png', config).isValid).toBe(true);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('public/styles/main.css', config).isValid).toBe(true);
        });
        it('should block directory traversal attempts', () => {
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('../../../etc/passwd', config).isValid).toBe(false);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('..\\..\\windows\\system32\\config', config).isValid).toBe(false);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('%2e%2e%2f%2e%2e%2fetc%2fpasswd', config).isValid).toBe(false);
        });
        it('should block sensitive directories', () => {
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('node_modules/lodash/index.js', config).isValid).toBe(false);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('.git/config', config).isValid).toBe(false);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('.env', config).isValid).toBe(false);
        });
        it('should block sensitive files', () => {
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('package.json', config).isValid).toBe(false);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('.env.local', config).isValid).toBe(false);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('config.json', config).isValid).toBe(false);
        });
        it('should block unauthorized extensions', () => {
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('public/assets/config.html', config).isValid).toBe(false);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('public/data/secrets.json', config).isValid).toBe(false);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('public/logs/app.log', config).isValid).toBe(false);
        });
        it('should handle encoded paths', () => {
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('public/assets/app%2ejs', config).isValid).toBe(false);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.validatePath('public/%2e%2e%2fetc%2fpasswd', config).isValid).toBe(false);
        });
    });
    describe('validatePaths', () => {
        it('should validate multiple paths', () => {
            const paths = [
                'public/assets/app.js',
                '../../../etc/passwd',
                'node_modules/lodash/index.js',
                'public/images/logo.png',
            ];
            const results = vite_static_path_validator_1.ViteStaticPathValidator.validatePaths(paths, config);
            expect(results.map(r => r.isValid)).toEqual([true, false, false, true]);
        });
    });
    describe('sanitizePath', () => {
        it('should normalize paths', () => {
            expect(vite_static_path_validator_1.ViteStaticPathValidator.sanitizePath('/public/assets/../styles/main.css')).toBe('/public/styles/main.css');
            expect(vite_static_path_validator_1.ViteStaticPathValidator.sanitizePath('/public/assets/./app.js')).toBe('/public/assets/app.js');
        });
        it('should decode URL encoding', () => {
            expect(vite_static_path_validator_1.ViteStaticPathValidator.sanitizePath('/public/assets/app%2ejs')).toBe('/public/assets/app.js');
            expect(vite_static_path_validator_1.ViteStaticPathValidator.sanitizePath('/public/images/logo%20icon.png')).toBe('/public/images/logo icon.png');
        });
        it('should prevent directory traversal in sanitization', () => {
            expect(vite_static_path_validator_1.ViteStaticPathValidator.sanitizePath('../../../etc/passwd')).toBe('/etc/passwd');
            expect(vite_static_path_validator_1.ViteStaticPathValidator.sanitizePath('..\\..\\windows\\system32')).toBe('/windows/system32');
        });
    });
    describe('shouldBlockPath', () => {
        it('should identify blocked paths', () => {
            expect(vite_static_path_validator_1.ViteStaticPathValidator.shouldBlockPath('node_modules/lodash/index.js', config)).toBe(true);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.shouldBlockPath('.git/config', config)).toBe(true);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.shouldBlockPath('package.json', config)).toBe(true);
            expect(vite_static_path_validator_1.ViteStaticPathValidator.shouldBlockPath('public/assets/app.js', config)).toBe(false);
        });
    });
});
describe('ViteStaticFileProtector', () => {
    let protector;
    beforeEach(() => {
        protector = new vite_static_file_protector_1.ViteStaticFileProtector({
            allowedExtensions: ['.js', '.css', '.png'],
            sensitiveDirectories: ['node_modules', '.git'],
            sensitiveFiles: ['package.json'],
            allowHtmlFiles: false,
            allowDotFiles: false,
        });
    });
    describe('protect', () => {
        it('should allow safe requests', async () => {
            const request = { url: '/public/assets/app.js', method: 'GET', headers: {} };
            const result = await protector.protect(request);
            expect(result.allowed).toBe(true);
        });
        it('should block directory traversal', async () => {
            const request = { url: '/../../../etc/passwd', method: 'GET', headers: {} };
            const result = await protector.protect(request);
            expect(result.allowed).toBe(false);
            expect(result.response?.status).toBe(403);
        });
        it('should block sensitive directories', async () => {
            const request = { url: '/node_modules/lodash/index.js', method: 'GET', headers: {} };
            const result = await protector.protect(request);
            expect(result.allowed).toBe(false);
        });
        it('should block unauthorized extensions', async () => {
            const request = { url: '/public/assets/config.html', method: 'GET', headers: {} };
            const result = await protector.protect(request);
            expect(result.allowed).toBe(false);
        });
        it('should allow non-GET methods', async () => {
            const request = { url: '/public/assets/app.js', method: 'POST', headers: {} };
            const result = await protector.protect(request);
            expect(result.allowed).toBe(true);
        });
    });
});
describe('SafeViteStaticServer', () => {
    let safeServer;
    beforeEach(() => {
        safeServer = new safe_vite_static_server_1.SafeViteStaticServer({
            root: '/app/public',
            allowedExtensions: ['.js', '.css', '.png'],
            sensitiveDirectories: ['node_modules'],
            sensitiveFiles: ['package.json'],
            allowHtmlFiles: false,
            allowDotFiles: false,
        });
    });
    describe('constructor', () => {
        it('should create instance with default config', () => {
            const server = new safe_vite_static_server_1.SafeViteStaticServer();
            expect(server).toBeInstanceOf(safe_vite_static_server_1.SafeViteStaticServer);
        });
        it('should create instance with custom config', () => {
            expect(safeServer).toBeInstanceOf(safe_vite_static_server_1.SafeViteStaticServer);
        });
    });
    describe('Integration Tests', () => {
        it('should work with ViteStaticFileProtector', async () => {
            const protector = new vite_static_file_protector_1.ViteStaticFileProtector({
                allowedExtensions: ['.js', '.css'],
                sensitiveDirectories: ['node_modules', '.git'],
            });
            const server = new safe_vite_static_server_1.SafeViteStaticServer({
                root: '/app/public',
                allowedExtensions: ['.js', '.css'],
                sensitiveDirectories: ['node_modules', '.git'],
                sensitiveFiles: ['package.json'],
                allowHtmlFiles: false,
                allowDotFiles: false,
            });
            const safeRequest = { url: '/assets/app.js', method: 'GET', headers: {} };
            const safeResult = await protector.protect(safeRequest);
            expect(safeResult.allowed).toBe(true);
            const blockedRequest = { url: '/../../../etc/passwd', method: 'GET', headers: {} };
            const blockedResult = await protector.protect(blockedRequest);
            expect(blockedResult.allowed).toBe(false);
        });
        it('should handle various attack vectors', () => {
            const attackVectors = [
                '../../../etc/passwd',
                '..\\..\\windows\\system32\\config',
                '%2e%2e%2f%2e%2e%2fetc%2fpasswd',
                '/node_modules/lodash/index.js',
                '/.git/config',
                '/.env',
                '/package.json',
                '/public/assets/config.html',
                '/public/data/secrets.json',
            ];
            attackVectors.forEach(vector => {
                const result = vite_static_path_validator_1.ViteStaticPathValidator.validatePath(vector, {
                    allowedExtensions: ['.js', '.css', '.png'],
                    sensitiveDirectories: ['node_modules', '.git', '.env'],
                    sensitiveFiles: ['package.json', '.env.local'],
                });
                expect(result.isValid).toBe(false);
            });
        });
    });
});
//# sourceMappingURL=vite-static-file-security.test.js.map