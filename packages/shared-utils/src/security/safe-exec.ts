/**
 * Safe Exec - Utilidad segura para ejecutar comandos del sistema
 * Mitiga vulnerabilidades de inyección de comandos detectadas por SonarQube
 */

import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { promisify } from 'util';

interface SafeExecOptions {
  timeout?: number;
  maxBuffer?: number;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  allowedCommands?: string[];
}

const DEFAULT_ALLOWED_COMMANDS = [
  'npm', 'npx', 'pnpm', 'yarn', 'node', 'tsx', 'jest', 'eslint', 'prettier',
  'git', 'madge', 'jscpd', 'ts-prune', 'sonar-scanner'
];

export class SafeExec {
  private allowedCommands: Set<string>;

  constructor(options: SafeExecOptions = {}) {
    this.allowedCommands = new Set(options.allowedCommands || DEFAULT_ALLOWED_COMMANDS);
  }

  /**
   * Ejecuta un comando de forma segura con validación
   */
  async execute(command: string, args: string[] = [], options: SafeExecOptions = {}): Promise<string> {
    // Validar comando
    if (!this.isCommandAllowed(command)) {
      throw new Error(`Command "${command}" is not in the allowed list`);
    }

    // Validar argumentos
    this.validateArguments(args);

    return new Promise((resolve, reject) => {
      const spawnOptions: SpawnOptionsWithoutStdio = {
        cwd: options.cwd || process.cwd(),
        env: { ...process.env, ...options.env },
        timeout: options.timeout || 30000
      };

      const child = spawn(command, args, spawnOptions);
      
      let stdout = '';
      let stderr = '';
      const maxBuffer = options.maxBuffer || 10 * 1024 * 1024; // 10MB default

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
        } else {
          reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
        }
      });
    });
  }

  /**
   * Ejecuta un comando de forma síncrona (usar con precaución)
   */
  executeSync(command: string, args: string[] = [], options: SafeExecOptions = {}): string {
    // Validar comando
    if (!this.isCommandAllowed(command)) {
      throw new Error(`Command "${command}" is not in the allowed list`);
    }

    // Validar argumentos
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
    } catch (error) {
      throw new Error(`Command failed: ${error.message}`);
    }
  }

  /**
   * Verifica si un comando está permitido
   */
  private isCommandAllowed(command: string): boolean {
    // Eliminar path si existe
    const baseCommand = command.split('/').pop() || command;
    return this.allowedCommands.has(baseCommand);
  }

  /**
   * Valida argumentos para prevenir inyección
   */
  private validateArguments(args: string[]): void {
    const dangerousPatterns = [
      /[;&|<>$`]/,  // Caracteres de shell peligrosos
      /\.\./,       // Path traversal
      /^-/          // Flags que podrían ser peligrosos
    ];

    args.forEach((arg, index) => {
      // Permitir flags comunes
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

  /**
   * Verifica si un flag es seguro
   */
  private isSafeFlag(flag: string): boolean {
    const safeFlags = [
      '--help', '--version', '--verbose', '--quiet', '--json',
      '--config', '--output', '--format', '--fix', '--no-fix',
      '--ext', '--ignore-path', '--max-warnings', '--debug',
      '--reporter', '--watch', '--coverage', '--bail'
    ];

    return safeFlags.some(safe => flag.startsWith(safe));
  }

  /**
   * Añade un comando a la lista de permitidos
   */
  addAllowedCommand(command: string): void {
    this.allowedCommands.add(command);
  }

  /**
   * Elimina un comando de la lista de permitidos
   */
  removeAllowedCommand(command: string): void {
    this.allowedCommands.delete(command);
  }
}

/**
 * Instancia singleton del ejecutor seguro
 */
export const safeExec = new SafeExec();

/**
 * Función helper para ejecutar comandos de forma segura
 */
export async function execSafe(
  command: string, 
  args: string[] = [], 
  options: SafeExecOptions = {}
): Promise<string> {
  return safeExec.execute(command, args, options);
}

/**
 * Función helper para ejecutar comandos de forma síncrona y segura
 */
export function execSafeSync(
  command: string, 
  args: string[] = [], 
  options: SafeExecOptions = {}
): string {
  return safeExec.executeSync(command, args, options);
}

/**
 * Utilidad para construir comandos de forma segura
 */
export class CommandBuilder {
  private command: string;
  private args: string[] = [];

  constructor(command: string) {
    this.command = command;
  }

  addArg(arg: string): this {
    this.args.push(arg);
    return this;
  }

  addFlag(flag: string, value?: string): this {
    this.args.push(flag);
    if (value !== undefined) {
      this.args.push(value);
    }
    return this;
  }

  async execute(options?: SafeExecOptions): Promise<string> {
    return execSafe(this.command, this.args, options);
  }

  executeSync(options?: SafeExecOptions): string {
    return execSafeSync(this.command, this.args, options);
  }

  toString(): string {
    return `${this.command} ${this.args.join(' ')}`;
  }
}