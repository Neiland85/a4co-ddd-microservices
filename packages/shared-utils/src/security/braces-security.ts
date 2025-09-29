import { exec, ExecOptions, spawn, SpawnOptions } from 'child_process';
import { EventEmitter } from 'events';

/**
 * Configuración de seguridad para expansión de braces
 */
export interface BracesSecurityConfig {
  // Límites de expansión
  maxExpansionSize?: number; // Número máximo de elementos expandidos (default: 1000)
  maxRangeSize?: number; // Tamaño máximo de un rango {1..N} (default: 100)
  maxBraceDepth?: number; // Profundidad máxima de anidamiento (default: 3)

  // Límites de recursos
  timeoutMs?: number; // Timeout para operaciones (default: 5000ms)
  maxMemoryMB?: number; // Memoria máxima por operación (default: 50MB)
  maxCpuPercent?: number; // CPU máxima por operación (default: 50%)

  // Patrones permitidos
  allowedPatterns?: RegExp[]; // Patrones regex permitidos
  blockedPatterns?: RegExp[]; // Patrones regex bloqueados

  // Monitoreo
  monitoringEnabled?: boolean;
  alertThresholds?: {
    expansionSize: number;
    processingTime: number;
    memoryUsage: number;
  };
}

/**
 * Estadísticas de expansión de braces
 */
export interface BracesExpansionStats {
  originalLength: number;
  expandedLength: number;
  expansionRatio: number;
  processingTime: number;
  memoryUsage: number;
  cpuUsage: number;
  braceCount: number;
  rangeCount: number;
  maxRangeSize: number;
}

/**
 * Resultado de validación de braces
 */
export interface BracesValidationResult {
  isValid: boolean;
  isSafe: boolean;
  issues: string[];
  stats: BracesExpansionStats;
  recommendedAction: 'allow' | 'block' | 'limit' | 'monitor';
}

/**
 * Validador y protector contra ataques de expansión de braces
 */
export class BracesSecurityValidator {
  private config: Required<BracesSecurityConfig>;
  private eventEmitter = new EventEmitter();

  constructor(config: BracesSecurityConfig = {}) {
    this.config = {
      maxExpansionSize: 1000,
      maxRangeSize: 100,
      maxBraceDepth: 3,
      timeoutMs: 5000,
      maxMemoryMB: 50,
      maxCpuPercent: 50,
      allowedPatterns: [],
      blockedPatterns: [
        /^\{.*\.\..*\}.*$/, // Cualquier expansión de rango
        /^\{.*,.*\}.*$/, // Expansión de listas
      ],
      monitoringEnabled: true,
      alertThresholds: {
        expansionSize: 100,
        processingTime: 1000, // 1 segundo
        memoryUsage: 10, // 10MB
      },
      ...config,
    };
  }

  /**
   * Valida una expresión que puede contener braces
   */
  async validateExpression(expression: string): Promise<BracesValidationResult> {
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;

    try {
      const stats = await this.analyzeExpression(expression);
      const processingTime = Date.now() - startTime;
      const memoryUsage = (process.memoryUsage().heapUsed - startMemory) / 1024 / 1024;

      stats.processingTime = processingTime;
      stats.memoryUsage = memoryUsage;

      const issues: string[] = [];
      let isSafe = true;
      let recommendedAction: 'allow' | 'block' | 'limit' | 'monitor' = 'allow';

      // Validar límites de expansión
      if (stats.expandedLength > this.config.maxExpansionSize) {
        issues.push(
          `Expansion too large: ${stats.expandedLength} > ${this.config.maxExpansionSize}`
        );
        isSafe = false;
        recommendedAction = 'block';
      }

      // Validar tamaño de rangos
      if (stats.maxRangeSize > this.config.maxRangeSize) {
        issues.push(`Range too large: ${stats.maxRangeSize} > ${this.config.maxRangeSize}`);
        isSafe = false;
        recommendedAction = 'block';
      }

      // Validar profundidad de anidamiento
      if (this.getBraceDepth(expression) > this.config.maxBraceDepth) {
        issues.push(`Brace depth too deep: > ${this.config.maxBraceDepth}`);
        isSafe = false;
        recommendedAction = 'block';
      }

      // Validar tiempo de procesamiento
      if (processingTime > this.config.alertThresholds.processingTime) {
        issues.push(`Processing too slow: ${processingTime}ms`);
        recommendedAction = 'monitor';
      }

      // Validar uso de memoria
      if (memoryUsage > this.config.alertThresholds.memoryUsage) {
        issues.push(`Memory usage too high: ${memoryUsage}MB`);
        recommendedAction = 'limit';
      }

      // Validar patrones bloqueados
      for (const blockedPattern of this.config.blockedPatterns) {
        if (blockedPattern.test(expression)) {
          issues.push(`Blocked pattern detected: ${blockedPattern}`);
          isSafe = false;
          recommendedAction = 'block';
          break;
        }
      }

      // Emitir alertas si está habilitado el monitoreo
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
    } catch (error) {
      return {
        isValid: false,
        isSafe: false,
        issues: [`Analysis failed: ${error instanceof Error ? error.message : String(error)}`],
        stats: this.createEmptyStats(expression),
        recommendedAction: 'block',
      };
    }
  }

  /**
   * Analiza una expresión y calcula estadísticas de expansión
   */
  private async analyzeExpression(expression: string): Promise<BracesExpansionStats> {
    const originalLength = expression.length;
    let expandedLength = 0;
    let braceCount = 0;
    let rangeCount = 0;
    let maxRangeSize = 0;

    // Contar braces y analizar rangos
    const braceRegex = /\{([^}]+)\}/g;
    let match;

    while ((match = braceRegex.exec(expression)) !== null) {
      braceCount++;
      const content = match[1];

      // Detectar rangos {start..end}
      const rangeMatch = content.match(/^(\d+)\.\.(\d+)$/);
      if (rangeMatch) {
        rangeCount++;
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        const rangeSize = Math.abs(end - start) + 1;
        maxRangeSize = Math.max(maxRangeSize, rangeSize);

        // Estimar tamaño de expansión (aproximado)
        expandedLength += rangeSize;
      } else {
        // Para otros tipos de braces, estimar expansión
        const alternatives = content.split(',');
        expandedLength += alternatives.length;
      }
    }

    // Si no hay braces, el tamaño expandido es el mismo
    if (braceCount === 0) {
      expandedLength = originalLength;
    }

    const expansionRatio = expandedLength / Math.max(originalLength, 1);

    return {
      originalLength,
      expandedLength,
      expansionRatio,
      processingTime: 0, // Se calcula después
      memoryUsage: 0, // Se calcula después
      cpuUsage: 0, // Se calcula después
      braceCount,
      rangeCount,
      maxRangeSize,
    };
  }

  /**
   * Calcula la profundidad máxima de anidamiento de braces
   */
  private getBraceDepth(expression: string): number {
    let maxDepth = 0;
    let currentDepth = 0;

    for (const char of expression) {
      if (char === '{') {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (char === '}') {
        currentDepth = Math.max(0, currentDepth - 1);
      }
    }

    return maxDepth;
  }

  /**
   * Enmascara datos sensibles en expresiones para logging
   */
  maskSensitiveData(expression: string): string {
    // Enmascarar posibles passwords, tokens, etc.
    return expression
      .replace(/password[=:]\s*[^&\s]+/gi, 'password=***')
      .replace(/token[=:]\s*[^&\s]+/gi, 'token=***')
      .replace(/secret[=:]\s*[^&\s]+/gi, 'secret=***');
  }

  /**
   * Crea estadísticas vacías para casos de error
   */
  private createEmptyStats(expression: string): BracesExpansionStats {
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

  /**
   * Event listeners para monitoreo
   */
  on(event: 'securityAlert', listener: (alert: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Obtener configuración actual
   */
  getConfig(): BracesSecurityConfig {
    return this.config;
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig: Partial<BracesSecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

/**
 * Ejecutor seguro de comandos shell con protección contra braces
 */
export class SecureShellExecutor {
  private validator: BracesSecurityValidator;
  private activeProcesses = new Map<number, { startTime: number; command: string }>();

  constructor(securityConfig?: BracesSecurityConfig) {
    this.validator = new BracesSecurityValidator(securityConfig);
  }

  /**
   * Ejecuta un comando de forma segura validando braces
   */
  async executeSecure(
    command: string,
    options?: ExecOptions
  ): Promise<{ stdout: string; stderr: string }> {
    // Validar el comando antes de ejecutarlo
    const validation = await this.validator.validateExpression(command);

    if (!validation.isSafe) {
      throw new Error(`Command blocked due to security concerns: ${validation.issues.join(', ')}`);
    }

    if (validation.recommendedAction === 'block') {
      throw new Error(`Command blocked: ${validation.issues.join(', ')}`);
    }

    // Configurar opciones con límites de recursos
    const secureOptions: ExecOptions = {
      timeout: this.validator.getConfig().timeoutMs,
      maxBuffer: 1024 * 1024, // 1MB buffer máximo
      ...options,
    };

    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const child = exec(command, secureOptions, (error, stdout, stderr) => {
        const executionTime = Date.now() - startTime;
        this.activeProcesses.delete(child.pid!);

        // Validar tiempo de ejecución
        if (executionTime > this.validator.getConfig().alertThresholds!.processingTime) {
          console.warn(`⚠️ Command execution took too long: ${executionTime}ms`);
        }

        if (error) {
          reject(error);
        } else {
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

  /**
   * Ejecuta un comando con spawn de forma segura
   */
  async spawnSecure(command: string, args: string[], options?: SpawnOptions): Promise<number> {
    // Validar comando y argumentos
    const fullCommand = [command, ...args].join(' ');
    const validation = await this.validator.validateExpression(fullCommand);

    if (!validation.isSafe) {
      throw new Error(`Command blocked due to security concerns: ${validation.issues.join(', ')}`);
    }

    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const child = spawn(command, args, {
        stdio: 'inherit',
        timeout: this.validator.getConfig().timeoutMs,
        ...options,
      });

      this.activeProcesses.set(child.pid!, {
        startTime,
        command: this.validator.maskSensitiveData(fullCommand),
      });

      child.on('close', code => {
        const executionTime = Date.now() - startTime;
        this.activeProcesses.delete(child.pid!);

        if (executionTime > this.validator.getConfig().alertThresholds!.processingTime) {
          console.warn(`⚠️ Spawn execution took too long: ${executionTime}ms`);
        }

        resolve(code || 0);
      });

      child.on('error', error => {
        this.activeProcesses.delete(child.pid!);
        reject(error);
      });
    });
  }

  /**
   * Obtener procesos activos
   */
  getActiveProcesses() {
    return Array.from(this.activeProcesses.entries()).map(([pid, info]) => ({
      pid,
      ...info,
      runningTime: Date.now() - info.startTime,
    }));
  }

  /**
   * Matar procesos que excedan el tiempo límite
   */
  killLongRunningProcesses(maxAgeMs: number = 30000): number {
    let killedCount = 0;
    const now = Date.now();

    for (const [pid, info] of this.activeProcesses.entries()) {
      if (now - info.startTime > maxAgeMs) {
        try {
          process.kill(pid, 'SIGTERM');
          this.activeProcesses.delete(pid);
          killedCount++;
          console.warn(`🛑 Killed long-running process: ${pid} (${info.command})`);
        } catch (error) {
          console.error(`Failed to kill process ${pid}:`, error);
        }
      }
    }

    return killedCount;
  }
}

/**
 * Factory para crear validadores y ejecutores seguros
 */
export class BracesSecurityFactory {
  static createValidator(config?: BracesSecurityConfig): BracesSecurityValidator {
    return new BracesSecurityValidator(config);
  }

  static createShellExecutor(config?: BracesSecurityConfig): SecureShellExecutor {
    return new SecureShellExecutor(config);
  }

  static createDefaultConfig(): BracesSecurityConfig {
    return {
      maxExpansionSize: 1000,
      maxRangeSize: 100,
      maxBraceDepth: 3,
      timeoutMs: 5000,
      maxMemoryMB: 50,
      maxCpuPercent: 50,
      allowedPatterns: [],
      blockedPatterns: [
        /^\{.*\.\..*\}.*$/, // Rangos {1..100}
        /^\{.*,.*\}.*$/, // Listas {a,b,c}
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

// Exportar singleton para uso global
export const bracesSecurityFactory = BracesSecurityFactory;
