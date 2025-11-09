"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environmentConfigs = exports.SecureCommandProcessor = void 0;
exports.basicValidationExample = basicValidationExample;
exports.customConfigurationExample = customConfigurationExample;
exports.secureShellExecutionExample = secureShellExecutionExample;
exports.monitoringExample = monitoringExample;
exports.attackPreventionExample = attackPreventionExample;
exports.createEnvironmentValidator = createEnvironmentValidator;
exports.runAllExamples = runAllExamples;
const braces_security_1 = require("./braces-security");
async function basicValidationExample() {
    const validator = braces_security_1.BracesSecurityFactory.createValidator();
    const safeExpressions = [
        'echo "hello world"',
        'ls -la {file1,file2}.txt',
        'mkdir -p {dir1,dir2,dir3}',
    ];
    const dangerousExpressions = [
        'echo {1..1000000}',
        'rm -rf {1..10000}',
        'find {1..5000} -exec rm {} \\;',
        '{{{a..z}..{1..100}}..{x..z}}',
    ];
    console.log('🔍 Validating expressions...\n');
    for (const expr of [...safeExpressions, ...dangerousExpressions]) {
        const result = await validator.validateExpression(expr);
        console.log(`Expression: ${expr}`);
        console.log(`  Safe: ${result.isSafe ? '✅' : '❌'}`);
        console.log(`  Valid: ${result.isValid ? '✅' : '❌'}`);
        console.log(`  Action: ${result.recommendedAction}`);
        console.log(`  Expansion size: ${result.stats.expandedLength}`);
        console.log(`  Max range size: ${result.stats.maxRangeSize}`);
        if (result.issues.length > 0) {
            console.log(`  Issues: ${result.issues.join(', ')}`);
        }
        console.log('');
    }
}
function customConfigurationExample() {
    const strictConfig = braces_security_1.BracesSecurityFactory.createDefaultConfig();
    strictConfig.maxExpansionSize = 10;
    strictConfig.maxRangeSize = 5;
    strictConfig.timeoutMs = 1000;
    const strictValidator = braces_security_1.BracesSecurityFactory.createValidator(strictConfig);
    const permissiveConfig = braces_security_1.BracesSecurityFactory.createDefaultConfig();
    permissiveConfig.maxExpansionSize = 10000;
    permissiveConfig.maxRangeSize = 1000;
    permissiveConfig.monitoringEnabled = true;
    const permissiveValidator = braces_security_1.BracesSecurityFactory.createValidator(permissiveConfig);
    return { strictValidator, permissiveValidator };
}
async function secureShellExecutionExample() {
    const executor = braces_security_1.BracesSecurityFactory.createShellExecutor();
    try {
        console.log('Ejecutando comando seguro...');
        const result = await executor.executeSecure('echo "Hello {1..3}"');
        console.log('Resultado:', result.stdout);
        console.log('Intentando ejecutar comando peligroso...');
        await executor.executeSecure('echo {1..100000}');
    }
    catch (error) {
        console.log('Comando bloqueado por seguridad:', error instanceof Error ? error.message : String(error));
    }
}
function monitoringExample() {
    const validator = braces_security_1.BracesSecurityFactory.createValidator();
    validator.on('securityAlert', alert => {
        console.log('[!] Security Alert:', alert);
    });
    return validator;
}
class SecureCommandProcessor {
    constructor() {
        this.validator = braces_security_1.BracesSecurityFactory.createValidator({
            maxExpansionSize: 100,
            maxRangeSize: 50,
            monitoringEnabled: true,
            alertThresholds: {
                expansionSize: 20,
                processingTime: 500,
                memoryUsage: 5,
            },
        });
    }
    async processUserCommand(command) {
        try {
            const validation = await this.validator.validateExpression(command);
            if (!validation.isSafe) {
                return {
                    allowed: false,
                    error: `Comando bloqueado: ${validation.issues.join(', ')}`,
                };
            }
            if (validation.recommendedAction === 'block') {
                return {
                    allowed: false,
                    error: 'Comando potencialmente peligroso',
                };
            }
            const simulatedResult = `Comando ejecutado: ${command} (expansión: ${validation.stats.expandedLength})`;
            return {
                allowed: true,
                result: simulatedResult,
            };
        }
        catch (error) {
            return {
                allowed: false,
                error: `Error de procesamiento: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }
    getSecurityStats() {
        return {
            config: this.validator.getConfig(),
        };
    }
}
exports.SecureCommandProcessor = SecureCommandProcessor;
async function attackPreventionExample() {
    const validator = braces_security_1.BracesSecurityFactory.createValidator();
    const attacks = [
        'for i in {1..1000000}; do echo $i; done',
        'echo {{{{{{{{{a..z}}}}}}}}}}',
        'echo {a..z}{1..100}{x..z}',
        'mkdir {1..1000}/{a..z}',
        'find /tmp -name "*.log" -exec rm {} \\; {1..10000}',
    ];
    console.log('🛡️ Testing attack prevention...\n');
    for (const attack of attacks) {
        const result = await validator.validateExpression(attack);
        console.log(`Attack: ${attack.substring(0, 50)}...`);
        console.log(`  Blocked: ${!result.isSafe ? '✅' : '❌'}`);
        console.log(`  Issues: ${result.issues.join(', ')}`);
        console.log('');
    }
}
exports.environmentConfigs = {
    development: {
        maxExpansionSize: 10000,
        maxRangeSize: 1000,
        monitoringEnabled: true,
        alertThresholds: {
            expansionSize: 1000,
            processingTime: 5000,
            memoryUsage: 100,
        },
    },
    staging: {
        maxExpansionSize: 1000,
        maxRangeSize: 100,
        monitoringEnabled: true,
        alertThresholds: {
            expansionSize: 500,
            processingTime: 2000,
            memoryUsage: 50,
        },
    },
    production: {
        maxExpansionSize: 100,
        maxRangeSize: 20,
        monitoringEnabled: true,
        alertThresholds: {
            expansionSize: 50,
            processingTime: 1000,
            memoryUsage: 10,
        },
    },
};
function createEnvironmentValidator(environment) {
    const config = exports.environmentConfigs[environment];
    return braces_security_1.BracesSecurityFactory.createValidator(config);
}
async function runAllExamples() {
    console.log('🚀 Running Braces Security Examples\n');
    await basicValidationExample();
    await secureShellExecutionExample();
    const processor = new SecureCommandProcessor();
    const result = await processor.processUserCommand('echo {1..5}');
    console.log('Processor result:', result);
    await attackPreventionExample();
    console.log('✅ All examples completed');
}
const isDirectExecution = Boolean(process?.argv?.[1]?.includes('braces-security-examples'));
if (isDirectExecution) {
    runAllExamples().catch(console.error);
}
//# sourceMappingURL=braces-security-examples.js.map