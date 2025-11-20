"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const braces_security_1 = require("./braces-security");
describe('BracesSecurityValidator', () => {
    let validator;
    beforeEach(() => {
        validator = braces_security_1.BracesSecurityFactory.createValidator();
    });
    describe('Expression Validation', () => {
        it('should allow safe expressions without braces', async () => {
            const result = await validator.validateExpression('echo "hello world"');
            expect(result.isValid).toBe(true);
            expect(result.isSafe).toBe(true);
            expect(result.recommendedAction).toBe('allow');
        });
        it('should allow small controlled expansions', async () => {
            const result = await validator.validateExpression('ls {file1,file2,file3}.txt');
            expect(result.isValid).toBe(true);
            expect(result.isSafe).toBe(true);
            expect(result.stats.expandedLength).toBe(3);
        });
        it('should block large range expansions', async () => {
            const result = await validator.validateExpression('echo {1..10000}');
            expect(result.isValid).toBe(false);
            expect(result.isSafe).toBe(false);
            expect(result.recommendedAction).toBe('block');
            expect(result.issues).toContain('Range too large: 10000 > 100');
        });
        it('should block massive expansions', async () => {
            const result = await validator.validateExpression('echo {1..100000}');
            expect(result.isValid).toBe(false);
            expect(result.isSafe).toBe(false);
            expect(result.issues).toContain('Expansion too large');
        });
        it('should detect deep brace nesting', async () => {
            const result = await validator.validateExpression('{{{a..z}..{1..10}}..{x..z}}');
            expect(result.isValid).toBe(false);
            expect(result.isSafe).toBe(false);
            expect(result.issues).toContain('Brace depth too deep');
        });
        it('should handle malformed expressions gracefully', async () => {
            const result = await validator.validateExpression('{unclosed brace');
            expect(result.isValid).toBe(true);
            expect(result.isSafe).toBe(true);
        });
    });
    describe('Statistics Calculation', () => {
        it('should calculate correct statistics for ranges', async () => {
            const result = await validator.validateExpression('echo {1..10}');
            expect(result.stats.braceCount).toBe(1);
            expect(result.stats.rangeCount).toBe(1);
            expect(result.stats.maxRangeSize).toBe(10);
            expect(result.stats.expandedLength).toBe(10);
        });
        it('should calculate correct statistics for lists', async () => {
            const result = await validator.validateExpression('echo {a,b,c,d}');
            expect(result.stats.braceCount).toBe(1);
            expect(result.stats.rangeCount).toBe(0);
            expect(result.stats.expandedLength).toBe(4);
        });
        it('should calculate expansion ratio', async () => {
            const result = await validator.validateExpression('x{a,b,c}');
            expect(result.stats.expansionRatio).toBeGreaterThan(1);
        });
    });
    describe('Custom Configuration', () => {
        it('should respect custom maxExpansionSize', async () => {
            const customValidator = braces_security_1.BracesSecurityFactory.createValidator({
                maxExpansionSize: 5,
            });
            const result = await customValidator.validateExpression('echo {1..10}');
            expect(result.isValid).toBe(false);
            expect(result.issues).toContain('Expansion too large: 10 > 5');
        });
        it('should respect custom maxRangeSize', async () => {
            const customValidator = braces_security_1.BracesSecurityFactory.createValidator({
                maxRangeSize: 5,
            });
            const result = await customValidator.validateExpression('echo {1..10}');
            expect(result.isValid).toBe(false);
            expect(result.issues).toContain('Range too large: 10 > 5');
        });
    });
    describe('Security Alerts', () => {
        it('should emit security alerts for suspicious expressions', async () => {
            const alertValidator = braces_security_1.BracesSecurityFactory.createValidator();
            const alerts = [];
            alertValidator.on('securityAlert', alert => {
                alerts.push(alert);
            });
            await alertValidator.validateExpression('echo {1..1000}');
            expect(alerts.length).toBe(1);
            expect(alerts[0].issues).toContain('Range too large');
        });
        it('should mask sensitive data in alerts', async () => {
            const alertValidator = braces_security_1.BracesSecurityFactory.createValidator();
            const alerts = [];
            alertValidator.on('securityAlert', alert => {
                alerts.push(alert);
            });
            await alertValidator.validateExpression('echo password=secret123 {1..1000}');
            expect(alerts[0].expression).toContain('password=***');
            expect(alerts[0].expression).not.toContain('secret123');
        });
    });
    describe('Pattern Blocking', () => {
        it('should block expressions matching blocked patterns', async () => {
            const result = await validator.validateExpression('echo {1..100}');
            expect(result.isValid).toBe(false);
            expect(result.issues).toContain('Blocked pattern detected');
        });
        it('should allow expressions not matching blocked patterns', async () => {
            const result = await validator.validateExpression('echo normal command');
            expect(result.isValid).toBe(true);
        });
    });
});
describe('SecureShellExecutor', () => {
    let executor;
    beforeEach(() => {
        executor = braces_security_1.BracesSecurityFactory.createShellExecutor();
    });
    describe('Command Execution', () => {
        it('should execute safe commands', async () => {
            const mockExec = jest.fn((command, options, callback) => {
                callback(null, 'output', '');
            });
            global.exec = mockExec;
            const result = await executor.executeSecure('echo "safe command"');
            expect(result.stdout).toBe('output');
        });
        it('should block dangerous commands', async () => {
            await expect(executor.executeSecure('echo {1..10000}')).rejects.toThrow('Command blocked due to security concerns');
        });
        it('should track active processes', () => {
            const processes = executor.getActiveProcesses();
            expect(Array.isArray(processes)).toBe(true);
        });
    });
    describe('Process Management', () => {
        it('should kill long running processes', () => {
            const killedCount = executor.killLongRunningProcesses(0);
            expect(typeof killedCount).toBe('number');
        });
    });
});
describe('BracesSecurityFactory', () => {
    it('should create validator with default config', () => {
        const validator = braces_security_1.BracesSecurityFactory.createValidator();
        expect(validator).toBeInstanceOf(braces_security_1.BracesSecurityValidator);
        const config = validator.getConfig();
        expect(config.maxExpansionSize).toBe(1000);
        expect(config.maxRangeSize).toBe(100);
    });
    it('should create validator with custom config', () => {
        const customConfig = {
            maxExpansionSize: 500,
            maxRangeSize: 50,
        };
        const validator = braces_security_1.BracesSecurityFactory.createValidator(customConfig);
        const config = validator.getConfig();
        expect(config.maxExpansionSize).toBe(500);
        expect(config.maxRangeSize).toBe(50);
    });
    it('should create shell executor', () => {
        const executor = braces_security_1.BracesSecurityFactory.createShellExecutor();
        expect(executor).toBeInstanceOf(braces_security_1.SecureShellExecutor);
    });
    it('should provide default configuration', () => {
        const config = braces_security_1.BracesSecurityFactory.createDefaultConfig();
        expect(config).toHaveProperty('maxExpansionSize', 1000);
        expect(config).toHaveProperty('maxRangeSize', 100);
        expect(config).toHaveProperty('monitoringEnabled', true);
    });
});
describe('Attack Prevention', () => {
    let validator;
    beforeEach(() => {
        validator = braces_security_1.BracesSecurityFactory.createValidator();
    });
    it('should prevent fork bomb attempts', async () => {
        const result = await validator.validateExpression(':(){ :|:& };:');
        expect(result.isValid).toBe(true);
    });
    it('should prevent massive brace expansions', async () => {
        const result = await validator.validateExpression('echo {a..z}{1..100}{A..Z}');
        expect(result.isValid).toBe(false);
        expect(result.issues.length).toBeGreaterThan(0);
    });
    it('should handle edge cases', async () => {
        const emptyResult = await validator.validateExpression('');
        expect(emptyResult.isValid).toBe(true);
        const emptyBracesResult = await validator.validateExpression('{}');
        expect(emptyBracesResult.isValid).toBe(true);
    });
    it('should validate processing time limits', async () => {
        const fastValidator = braces_security_1.BracesSecurityFactory.createValidator({
            alertThresholds: {
                expansionSize: 100,
                processingTime: 1,
                memoryUsage: 10,
            },
        });
        const complexExpression = 'echo {' + 'a,'.repeat(1000) + '}';
        const result = await fastValidator.validateExpression(complexExpression);
        expect(result).toBeDefined();
    });
});
//# sourceMappingURL=braces-security.test.js.map