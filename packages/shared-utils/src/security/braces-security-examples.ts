/**
 * Ejemplos de uso del sistema de seguridad contra ataques de braces
 *
 * Este archivo muestra cómo usar BracesSecurityValidator y SecureShellExecutor
 * para prevenir ataques de expansión de braces que pueden causar DoS.
 */

// Importar las utilidades de seguridad
import {
  BracesSecurityFactory,
  BracesSecurityValidator,
  BracesValidationResult,
} from './braces-security';

/**
 * Ejemplo 1: Validación básica de expresiones con braces
 */
export async function basicValidationExample() {
  const validator = BracesSecurityFactory.createValidator();

  // Expresiones seguras
  const safeExpressions = [
    'echo "hello world"', // Sin braces
    'ls -la {file1,file2}.txt', // Expansión pequeña y controlada
    'mkdir -p {dir1,dir2,dir3}', // Lista pequeña
  ];

  // Expresiones peligrosas (deben ser bloqueadas)
  const dangerousExpressions = [
    'echo {1..1000000}', // Rango masivo - DoS
    'rm -rf {1..10000}', // Rango grande
    'find {1..5000} -exec rm {} \\;', // Expansión compleja
    '{{{a..z}..{1..100}}..{x..z}}', // Anidamiento profundo
  ];

  console.log('🔍 Validating expressions...\n');

  for (const expr of [...safeExpressions, ...dangerousExpressions]) {
    const result: BracesValidationResult = await validator.validateExpression(expr);

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

/**
 * Ejemplo 2: Configuración personalizada para diferentes contextos
 */
export function customConfigurationExample() {
  // Configuración estricta para comandos críticos
  const strictConfig = BracesSecurityFactory.createDefaultConfig();
  strictConfig.maxExpansionSize = 10; // Solo 10 elementos máximo
  strictConfig.maxRangeSize = 5; // Rangos de máximo 5 elementos
  strictConfig.timeoutMs = 1000; // 1 segundo máximo

  const strictValidator = BracesSecurityFactory.createValidator(strictConfig);

  // Configuración permisiva para scripts de desarrollo
  const permissiveConfig = BracesSecurityFactory.createDefaultConfig();
  permissiveConfig.maxExpansionSize = 10000; // Hasta 10k elementos
  permissiveConfig.maxRangeSize = 1000; // Rangos hasta 1000
  permissiveConfig.monitoringEnabled = true; // Solo monitoreo

  const permissiveValidator = BracesSecurityFactory.createValidator(permissiveConfig);

  return { strictValidator, permissiveValidator };
}

/**
 * Ejemplo 3: Ejecutor seguro de comandos shell
 */
export async function secureShellExecutionExample() {
  const executor = BracesSecurityFactory.createShellExecutor();

  try {
    // Comando seguro
    console.log('Ejecutando comando seguro...');
    const result = await executor.executeSecure('echo "Hello {1..3}"');
    console.log('Resultado:', result.stdout);

    // Comando peligroso (debe fallar)
    console.log('Intentando ejecutar comando peligroso...');
    await executor.executeSecure('echo {1..100000}'); // Debe ser bloqueado
  } catch (error) {
    console.log(
      'Comando bloqueado por seguridad:',
      error instanceof Error ? error.message : String(error),
    );
  }
}

/**
 * Ejemplo 4: Monitoreo y alertas en tiempo real
 */
export function monitoringExample() {
  const validator = BracesSecurityFactory.createValidator();

  // Configurar alertas
  validator.on('securityAlert', (alert) => {
    console.log('[!] Security Alert:', alert);

    // Aquí podrías:
    // - Enviar alertas a un sistema de monitoreo
    // - Bloquear IPs
    // - Registrar en logs de seguridad
    // - Notificar a administradores
  });

  return validator;
}

/**
 * Ejemplo 5: Integración con APIs y procesamiento de usuario
 */
export class SecureCommandProcessor {
  private validator: BracesSecurityValidator;

  constructor() {
    this.validator = BracesSecurityFactory.createValidator({
      maxExpansionSize: 100, // Límite razonable para APIs
      maxRangeSize: 50, // Rangos moderados
      monitoringEnabled: true, // Monitoreo activado
      alertThresholds: {
        expansionSize: 20, // Alertar si > 20 elementos
        processingTime: 500, // Alertar si > 500ms
        memoryUsage: 5, // Alertar si > 5MB
      },
    });
  }

  /**
   * Procesa un comando de usuario de forma segura
   */
  async processUserCommand(command: string): Promise<{
    allowed: boolean;
    result?: string;
    error?: string;
  }> {
    try {
      // Validar la expresión
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

      // Aquí iría la ejecución real del comando
      // Por ahora solo simulamos
      const simulatedResult = `Comando ejecutado: ${command} (expansión: ${validation.stats.expandedLength})`;

      return {
        allowed: true,
        result: simulatedResult,
      };
    } catch (error) {
      return {
        allowed: false,
        error: `Error de procesamiento: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Estadísticas de seguridad
   */
  getSecurityStats() {
    return {
      config: this.validator.getConfig(),
      // Aquí podrías agregar más métricas
    };
  }
}

/**
 * Ejemplo 6: Protección contra ataques específicos
 */
export async function attackPreventionExample() {
  const validator = BracesSecurityFactory.createValidator();

  // Ataques comunes de braces expansion
  const attacks = [
    // DoS por expansión masiva
    'for i in {1..1000000}; do echo $i; done',

    // DoS por anidamiento profundo
    'echo {{{{{{{{{a..z}}}}}}}}}}',

    // DoS por combinaciones explosivas
    'echo {a..z}{1..100}{x..z}',

    // Ataques más sutiles
    'mkdir {1..1000}/{a..z}',

    // Ataques en comandos del sistema
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

/**
 * Ejemplo 7: Configuración para diferentes entornos
 */
export const environmentConfigs = {
  development: {
    maxExpansionSize: 10000, // Más permisivo en dev
    maxRangeSize: 1000,
    monitoringEnabled: true,
    alertThresholds: {
      expansionSize: 1000,
      processingTime: 5000,
      memoryUsage: 100,
    },
  },

  staging: {
    maxExpansionSize: 1000, // Moderado en staging
    maxRangeSize: 100,
    monitoringEnabled: true,
    alertThresholds: {
      expansionSize: 500,
      processingTime: 2000,
      memoryUsage: 50,
    },
  },

  production: {
    maxExpansionSize: 100, // Estricto en prod
    maxRangeSize: 20,
    monitoringEnabled: true,
    alertThresholds: {
      expansionSize: 50,
      processingTime: 1000,
      memoryUsage: 10,
    },
  },
};

/**
 * Factory para crear validadores según entorno
 */
export function createEnvironmentValidator(environment: keyof typeof environmentConfigs) {
  const config = environmentConfigs[environment];
  return BracesSecurityFactory.createValidator(config);
}

/**
 * Función principal para demostrar todos los ejemplos
 */
export async function runAllExamples() {
  console.log('🚀 Running Braces Security Examples\n');

  // Ejemplo 1: Validación básica
  await basicValidationExample();

  // Ejemplo 3: Ejecución segura
  await secureShellExecutionExample();

  // Ejemplo 5: Procesador seguro
  const processor = new SecureCommandProcessor();
  const result = await processor.processUserCommand('echo {1..5}');
  console.log('Processor result:', result);

  // Ejemplo 6: Prevención de ataques
  await attackPreventionExample();

  console.log('✅ All examples completed');
}

// Ejecutar ejemplos si se llama directamente (evita import.meta para compatibilidad CommonJS)
const isDirectExecution = Boolean(process?.argv?.[1]?.includes('braces-security-examples'));

if (isDirectExecution) {
  runAllExamples().catch(console.error);
}
