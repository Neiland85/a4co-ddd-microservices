"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bracesSecurityFactory = exports.BracesSecurityFactory = exports.SecureShellExecutor = exports.BracesSecurityValidator = void 0;
const child_process_1 = require("child_process");
const events_1 = require("events");
class BracesSecurityValidator {
    constructor(config = {}) {
        this.eventEmitter = new events_1.EventEmitter();
        this.config = {
            maxExpansionSize: 1000,
            maxRangeSize: 100,
            maxBraceDepth: 3,
            timeoutMs: 5000,
            maxMemoryMB: 50,
            maxCpuPercent: 50,
            allowedPatterns: [],
            blockedPatterns: [
                /^\{.*\.\..*\}.*$/,
                /^\{.*,.*\}.*$/,
            ],
            monitoringEnabled: true,
            alertThresholds: {
                expansionSize: 100,
                processingTime: 1000,
                memoryUsage: 10,
            },
            ...config,
        };
    }
    async validateExpression(expression) {
        const startTime = Date.now();
        const startMemory = process.memoryUsage().heapUsed;
        try {
            const stats = await this.analyzeExpression(expression);
            const processingTime = Date.now() - startTime;
            const memoryUsage = (process.memoryUsage().heapUsed - startMemory) / 1024 / 1024;
            stats.processingTime = processingTime;
            stats.memoryUsage = memoryUsage;
            const issues = [];
            let isSafe = true;
            let recommendedAction = 'allow';
            if (stats.expandedLength > this.config.maxExpansionSize) {
                issues.push(`Expansion too large: ${stats.expandedLength} > ${this.config.maxExpansionSize}`);
                isSafe = false;
                recommendedAction = 'block';
            }
            if (stats.maxRangeSize > this.config.maxRangeSize) {
                issues.push(`Range too large: ${stats.maxRangeSize} > ${this.config.maxRangeSize}`);
                isSafe = false;
                recommendedAction = 'block';
            }
            if (this.getBraceDepth(expression) > this.config.maxBraceDepth) {
                issues.push(`Brace depth too deep: > ${this.config.maxBraceDepth}`);
                isSafe = false;
                recommendedAction = 'block';
            }
            if (processingTime > this.config.alertThresholds.processingTime) {
                issues.push(`Processing too slow: ${processingTime}ms`);
                recommendedAction = 'monitor';
            }
            if (memoryUsage > this.config.alertThresholds.memoryUsage) {
                issues.push(`Memory usage too high: ${memoryUsage}MB`);
                recommendedAction = 'limit';
            }
            for (const blockedPattern of this.config.blockedPatterns) {
                if (blockedPattern.test(expression)) {
                    issues.push(`Blocked pattern detected: ${blockedPattern}`);
                    isSafe = false;
                    recommendedAction = 'block';
                    break;
                }
            }
            if (this.config.monitoringEnabled && (issues.length > 0 || stats.expansionRatio > 10)) {
                this.eventEmitter.emit('securityAlert', {
                    expression: this.maskSensitiveData(expression),
                    issues,
                    stats,
                    timestamp: new Date().toISOString(),
                });
            }
            return {
                isValid: issues.length === 0,
                isSafe,
                issues,
                stats,
                recommendedAction,
            };
        }
        catch (error) {
            return {
                isValid: false,
                isSafe: false,
                issues: [`Analysis failed: ${error instanceof Error ? error.message : String(error)}`],
                stats: this.createEmptyStats(expression),
                recommendedAction: 'block',
            };
        }
    }
    async analyzeExpression(expression) {
        const originalLength = expression.length;
        let expandedLength = 0;
        let braceCount = 0;
        let rangeCount = 0;
        let maxRangeSize = 0;
        const braceRegex = /\{([^}]+)\}/g;
        let match;
        while ((match = braceRegex.exec(expression)) !== null) {
            braceCount++;
            const content = match[1];
            const rangeMatch = content.match(/^(\d+)\.\.(\d+)$/);
            if (rangeMatch) {
                rangeCount++;
                const start = parseInt(rangeMatch[1]);
                const end = parseInt(rangeMatch[2]);
                const rangeSize = Math.abs(end - start) + 1;
                maxRangeSize = Math.max(maxRangeSize, rangeSize);
                expandedLength += rangeSize;
            }
            else {
                const alternatives = content.split(',');
                expandedLength += alternatives.length;
            }
        }
        if (braceCount === 0) {
            expandedLength = originalLength;
        }
        const expansionRatio = expandedLength / Math.max(originalLength, 1);
        return {
            originalLength,
            expandedLength,
            expansionRatio,
            processingTime: 0,
            memoryUsage: 0,
            cpuUsage: 0,
            braceCount,
            rangeCount,
            maxRangeSize,
        };
    }
    getBraceDepth(expression) {
        let maxDepth = 0;
        let currentDepth = 0;
        for (const char of expression) {
            if (char === '{') {
                currentDepth++;
                maxDepth = Math.max(maxDepth, currentDepth);
            }
            else if (char === '}') {
                currentDepth = Math.max(0, currentDepth - 1);
            }
        }
        return maxDepth;
    }
    maskSensitiveData(expression) {
        return expression
            .replace(/password[=:]\s*[^&\s]+/gi, 'password=***')
            .replace(/token[=:]\s*[^&\s]+/gi, 'token=***')
            .replace(/secret[=:]\s*[^&\s]+/gi, 'secret=***');
    }
    createEmptyStats(expression) {
        return {
            originalLength: expression.length,
            expandedLength: 0,
            expansionRatio: 0,
            processingTime: 0,
            memoryUsage: 0,
            cpuUsage: 0,
            braceCount: 0,
            rangeCount: 0,
            maxRangeSize: 0,
        };
    }
    on(event, listener) {
        this.eventEmitter.on(event, listener);
    }
    getConfig() {
        return this.config;
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
exports.BracesSecurityValidator = BracesSecurityValidator;
class SecureShellExecutor {
    constructor(securityConfig) {
        this.activeProcesses = new Map();
        this.validator = new BracesSecurityValidator(securityConfig);
    }
    async executeSecure(command, options) {
        const validation = await this.validator.validateExpression(command);
        if (!validation.isSafe) {
            throw new Error(`Command blocked due to security concerns: ${validation.issues.join(', ')}`);
        }
        if (validation.recommendedAction === 'block') {
            throw new Error(`Command blocked: ${validation.issues.join(', ')}`);
        }
        const secureOptions = {
            timeout: this.validator.getConfig().timeoutMs,
            maxBuffer: 1024 * 1024,
            ...options,
        };
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const child = (0, child_process_1.exec)(command, secureOptions, (error, stdout, stderr) => {
                const executionTime = Date.now() - startTime;
                this.activeProcesses.delete(child.pid);
                if (executionTime > this.validator.getConfig().alertThresholds.processingTime) {
                    console.warn(`⚠️ Command execution took too long: ${executionTime}ms`);
                }
                if (error) {
                    reject(error);
                }
                else {
                    resolve({
                        stdout: stdout.toString(),
                        stderr: stderr.toString()
                    });
                }
            });
            if (child.pid) {
                this.activeProcesses.set(child.pid, {
                    startTime,
                    command: this.validator.maskSensitiveData(command),
                });
            }
        });
    }
    async spawnSecure(command, args, options) {
        const fullCommand = [command, ...args].join(' ');
        const validation = await this.validator.validateExpression(fullCommand);
        if (!validation.isSafe) {
            throw new Error(`Command blocked due to security concerns: ${validation.issues.join(', ')}`);
        }
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const child = (0, child_process_1.spawn)(command, args, {
                stdio: 'inherit',
                timeout: this.validator.getConfig().timeoutMs,
                ...options,
            });
            this.activeProcesses.set(child.pid, {
                startTime,
                command: this.validator.maskSensitiveData(fullCommand),
            });
            child.on('close', code => {
                const executionTime = Date.now() - startTime;
                this.activeProcesses.delete(child.pid);
                if (executionTime > this.validator.getConfig().alertThresholds.processingTime) {
                    console.warn(`⚠️ Spawn execution took too long: ${executionTime}ms`);
                }
                resolve(code || 0);
            });
            child.on('error', error => {
                this.activeProcesses.delete(child.pid);
                reject(error);
            });
        });
    }
    getActiveProcesses() {
        return Array.from(this.activeProcesses.entries()).map(([pid, info]) => ({
            pid,
            ...info,
            runningTime: Date.now() - info.startTime,
        }));
    }
    killLongRunningProcesses(maxAgeMs = 30000) {
        let killedCount = 0;
        const now = Date.now();
        for (const [pid, info] of this.activeProcesses.entries()) {
            if (now - info.startTime > maxAgeMs) {
                try {
                    process.kill(pid, 'SIGTERM');
                    this.activeProcesses.delete(pid);
                    killedCount++;
                    console.warn(`🛑 Killed long-running process: ${pid} (${info.command})`);
                }
                catch (error) {
                    console.error(`Failed to kill process ${pid}:`, error);
                }
            }
        }
        return killedCount;
    }
}
exports.SecureShellExecutor = SecureShellExecutor;
class BracesSecurityFactory {
    static createValidator(config) {
        return new BracesSecurityValidator(config);
    }
    static createShellExecutor(config) {
        return new SecureShellExecutor(config);
    }
    static createDefaultConfig() {
        return {
            maxExpansionSize: 1000,
            maxRangeSize: 100,
            maxBraceDepth: 3,
            timeoutMs: 5000,
            maxMemoryMB: 50,
            maxCpuPercent: 50,
            allowedPatterns: [],
            blockedPatterns: [
                /^\{.*\.\..*\}.*$/,
                /^\{.*,.*\}.*$/,
            ],
            monitoringEnabled: true,
            alertThresholds: {
                expansionSize: 100,
                processingTime: 1000,
                memoryUsage: 10,
            },
        };
    }
}
exports.BracesSecurityFactory = BracesSecurityFactory;
exports.bracesSecurityFactory = BracesSecurityFactory;
//# sourceMappingURL=braces-security.js.map