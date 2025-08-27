"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBuilder = exports.safeExec = exports.SafeExec = void 0;
exports.execSafe = execSafe;
exports.execSafeSync = execSafeSync;
const child_process_1 = require("child_process");
const DEFAULT_ALLOWED_COMMANDS = [
    'npm', 'npx', 'pnpm', 'yarn', 'node', 'tsx', 'jest', 'eslint', 'prettier',
    'git', 'madge', 'jscpd', 'ts-prune', 'sonar-scanner'
];
class SafeExec {
    allowedCommands;
    constructor(options = {}) {
        this.allowedCommands = new Set(options.allowedCommands || DEFAULT_ALLOWED_COMMANDS);
    }
    async execute(command, args = [], options = {}) {
        if (!this.isCommandAllowed(command)) {
            throw new Error(`Command "${command}" is not in the allowed list`);
        }
        this.validateArguments(args);
        return new Promise((resolve, reject) => {
            const spawnOptions = {
                cwd: options.cwd || process.cwd(),
                env: { ...process.env, ...options.env },
                timeout: options.timeout || 30000
            };
            const child = (0, child_process_1.spawn)(command, args, spawnOptions);
            let stdout = '';
            let stderr = '';
            const maxBuffer = options.maxBuffer || 10 * 1024 * 1024;
            child.stdout.on('data', (data) => {
                stdout += data.toString();
                if (stdout.length > maxBuffer) {
                    child.kill();
                    reject(new Error('stdout exceeded buffer limit'));
                }
            });
            child.stderr.on('data', (data) => {
                stderr += data.toString();
                if (stderr.length > maxBuffer) {
                    child.kill();
                    reject(new Error('stderr exceeded buffer limit'));
                }
            });
            child.on('error', (error) => {
                reject(error);
            });
            child.on('close', (code) => {
                if (code === 0) {
                    resolve(stdout);
                }
                else {
                    reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
                }
            });
        });
    }
    executeSync(command, args = [], options = {}) {
        if (!this.isCommandAllowed(command)) {
            throw new Error(`Command "${command}" is not in the allowed list`);
        }
        this.validateArguments(args);
        const { execFileSync } = require('child_process');
        try {
            return execFileSync(command, args, {
                cwd: options.cwd || process.cwd(),
                env: { ...process.env, ...options.env },
                encoding: 'utf8',
                maxBuffer: options.maxBuffer || 10 * 1024 * 1024,
                timeout: options.timeout || 30000
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Command failed: ${errorMessage}`);
        }
    }
    isCommandAllowed(command) {
        const baseCommand = command.split('/').pop() || command;
        return this.allowedCommands.has(baseCommand);
    }
    validateArguments(args) {
        const dangerousPatterns = [
            /[;&|<>$`]/,
            /\.\./,
            /^-/
        ];
        args.forEach((arg, index) => {
            if (arg.startsWith('-') && this.isSafeFlag(arg)) {
                return;
            }
            dangerousPatterns.forEach(pattern => {
                if (pattern.test(arg)) {
                    throw new Error(`Potentially dangerous argument at position ${index}: ${arg}`);
                }
            });
        });
    }
    isSafeFlag(flag) {
        const safeFlags = [
            '--help', '--version', '--verbose', '--quiet', '--json',
            '--config', '--output', '--format', '--fix', '--no-fix',
            '--ext', '--ignore-path', '--max-warnings', '--debug',
            '--reporter', '--watch', '--coverage', '--bail'
        ];
        return safeFlags.some(safe => flag.startsWith(safe));
    }
    addAllowedCommand(command) {
        this.allowedCommands.add(command);
    }
    removeAllowedCommand(command) {
        this.allowedCommands.delete(command);
    }
}
exports.SafeExec = SafeExec;
exports.safeExec = new SafeExec();
async function execSafe(command, args = [], options = {}) {
    return exports.safeExec.execute(command, args, options);
}
function execSafeSync(command, args = [], options = {}) {
    return exports.safeExec.executeSync(command, args, options);
}
class CommandBuilder {
    command;
    args = [];
    constructor(command) {
        this.command = command;
    }
    addArg(arg) {
        this.args.push(arg);
        return this;
    }
    addFlag(flag, value) {
        this.args.push(flag);
        if (value !== undefined) {
            this.args.push(value);
        }
        return this;
    }
    async execute(options) {
        return execSafe(this.command, this.args, options);
    }
    executeSync(options) {
        return execSafeSync(this.command, this.args, options);
    }
    toString() {
        return `${this.command} ${this.args.join(' ')}`;
    }
}
exports.CommandBuilder = CommandBuilder;
//# sourceMappingURL=safe-exec.js.map