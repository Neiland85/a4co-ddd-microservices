import { exec } from 'child_process';
import { promises as fs, FSWatcher } from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Utilidad segura para manejo de archivos tar con protección contra symlink bypass
 * Implementa mitigaciones para CVE relacionado con tar-fs symlink validation bypass
 */
export class SecureTarHandler {
  private readonly allowedExtensions = ['.tar', '.tar.gz', '.tgz', '.tar.bz2', '.tar.xz'];
  private readonly maxFileSize = 100 * 1024 * 1024; // 100MB
  private readonly maxPathLength = 260; // Windows MAX_PATH
  private readonly dangerousPaths = [
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

  /**
   * Valida si un archivo tar es seguro para extraer
   */
  async validateTarFile(filePath: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Validar extensión del archivo
      const ext = path.extname(filePath).toLowerCase();
      const baseName = path.basename(filePath).toLowerCase();

      if (
        !this.allowedExtensions.some(
          allowedExt => baseName.endsWith(allowedExt) || ext === allowedExt
        )
      ) {
        errors.push(`Extensión de archivo no permitida: ${ext}`);
      }

      // Validar tamaño del archivo
      const stats = await fs.stat(filePath);
      if (stats.size > this.maxFileSize) {
        errors.push(`Archivo demasiado grande: ${stats.size} bytes (máximo: ${this.maxFileSize})`);
      }

      // Validar contenido del tar (simulación de listado)
      const { stdout } = await execAsync(`tar -tf "${filePath}" 2>/dev/null | head -50`);

      const files = stdout.split('\n').filter(line => line.trim());

      for (const file of files) {
        // Validar longitud de path
        if (file.length > this.maxPathLength) {
          errors.push(`Path demasiado largo: ${file}`);
          continue;
        }

        // Detectar symlinks peligrosos
        if (file.includes(' -> ')) {
          const [linkPath, targetPath] = file.split(' -> ');
          if (this.isDangerousPath(targetPath)) {
            errors.push(`Symlink peligroso detectado: ${linkPath} -> ${targetPath}`);
          }
        }

        // Validar paths absolutos
        if (path.isAbsolute(file)) {
          warnings.push(`Path absoluto detectado: ${file}`);
        }

        // Validar paths con .. (directory traversal)
        if (file.includes('../') || file.startsWith('../')) {
          errors.push(`Directory traversal detectado: ${file}`);
        }

        // Validar caracteres peligrosos
        if (/[<>:"|?*\x00-\x1f]/.test(file)) {
          errors.push(`Caracteres peligrosos en path: ${file}`);
        }
      }
    } catch (error) {
      errors.push(
        `Error al validar archivo tar: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Extrae un archivo tar de forma segura en un directorio sandbox
   */
  async extractSecurely(
    tarPath: string,
    targetDir: string,
    options: {
      createSandbox?: boolean;
      user?: string;
      validateChecksum?: boolean;
      checksumFile?: string;
    } = {}
  ): Promise<{
    success: boolean;
    extractedFiles: string[];
    errors: string[];
  }> {
    const errors: string[] = [];
    const extractedFiles: string[] = [];

    try {
      // Validar el archivo tar primero
      const validation = await this.validateTarFile(tarPath);
      if (!validation.isValid) {
        return {
          success: false,
          extractedFiles: [],
          errors: validation.errors,
        };
      }

      // Crear directorio de extracción seguro
      const safeTargetDir = options.createSandbox
        ? await this.createSandboxDirectory(targetDir)
        : targetDir;

      // Extraer con opciones de seguridad
      const extractCommand = this.buildSecureExtractCommand(tarPath, safeTargetDir, options);

      const { stdout, stderr } = await execAsync(extractCommand);

      if (stderr && !stderr.includes('tar: Removing leading')) {
        errors.push(`Errores durante extracción: ${stderr}`);
      }

      // Verificar archivos extraídos
      const { stdout: listOutput } = await execAsync(
        `find "${safeTargetDir}" -type f -newer "${tarPath}" 2>/dev/null | head -100`
      );

      extractedFiles.push(...listOutput.split('\n').filter(line => line.trim()));

      // Limpiar sandbox si fue creado
      if (options.createSandbox && safeTargetDir !== targetDir) {
        // Mantener sandbox para inspección manual
      }
    } catch (error) {
      errors.push(
        `Error durante extracción segura: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    return {
      success: errors.length === 0,
      extractedFiles,
      errors,
    };
  }

  /**
   * Crea un directorio sandbox para extracción segura
   */
  private async createSandboxDirectory(baseDir: string): Promise<string> {
    const sandboxId = `sandbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sandboxPath = path.join(baseDir, sandboxId);

    await fs.mkdir(sandboxPath, { recursive: true });

    // Crear archivo de metadata
    await fs.writeFile(
      path.join(sandboxPath, '.sandbox_info'),
      JSON.stringify(
        {
          created: new Date().toISOString(),
          purpose: 'Secure tar extraction sandbox',
          cleanup_after: 'manual_review',
        },
        null,
        2
      )
    );

    return sandboxPath;
  }

  /**
   * Construye comando de extracción seguro
   */
  private buildSecureExtractCommand(tarPath: string, targetDir: string, options: any): string {
    const parts = ['tar'];

    // Opciones de seguridad
    parts.push('--no-same-owner'); // No preservar ownership
    parts.push('--no-same-permissions'); // No preservar permisos
    parts.push('--no-overwrite-dir'); // No sobrescribir directorios existentes
    parts.push('--delay-directory-restore'); // Delay directory updates

    // Evitar seguir symlinks
    parts.push('--no-dereference');
    parts.push('--no-recursion');

    // Extraer
    parts.push('-xf', `"${tarPath}"`);
    parts.push('-C', `"${targetDir}"`);

    // Solo extraer archivos normales, no dispositivos o pipes
    parts.push('--exclude-from=<(find /dev -type b -o -type c -o -type p 2>/dev/null)');

    return parts.join(' ');
  }

  /**
   * Verifica si un path es potencialmente peligroso
   */
  private isDangerousPath(filePath: string): boolean {
    const normalizedPath = path.normalize(filePath).toLowerCase();

    return this.dangerousPaths.some(
      dangerous =>
        normalizedPath.includes(dangerous.toLowerCase()) ||
        normalizedPath.startsWith(dangerous.toLowerCase())
    );
  }

  /**
   * Valida checksum de archivo tar
   */
  async validateChecksum(
    filePath: string,
    expectedChecksum: string,
    algorithm: 'sha256' | 'sha512' = 'sha256'
  ): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`${algorithm}sum "${filePath}"`);
      const actualChecksum = stdout.split(' ')[0];
      return actualChecksum === expectedChecksum;
    } catch {
      return false;
    }
  }

  /**
   * Monitorea cambios en archivos sensibles después de extracción
   */
  async monitorFileChanges(
    watchPaths: string[],
    callback: (changedFiles: string[]) => void
  ): Promise<() => void> {
    // Implementación básica de monitoreo
    const fs = require('fs');
    const watchers: FSWatcher[] = [];

    for (const watchPath of watchPaths) {
      try {
        const watcher = fs.watch(watchPath, (eventType, filename) => {
          if (filename) {
            callback([path.join(watchPath, filename)]);
          }
        });
        watchers.push(watcher);
      } catch (error) {
        console.warn(
          `No se pudo monitorear ${watchPath}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    return () => {
      watchers.forEach(watcher => watcher.close());
    };
  }
}

/**
 * Middleware de seguridad para operaciones con archivos tar
 */
export class TarSecurityMiddleware {
  private secureHandler = new SecureTarHandler();

  /**
   * Hook para interceptar operaciones de extracción de tar
   */
  async beforeExtract(tarPath: string, targetDir: string): Promise<void> {
    const validation = await this.secureHandler.validateTarFile(tarPath);

    if (!validation.isValid) {
      throw new Error(`Archivo tar no seguro: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      console.warn('Advertencias de seguridad:', validation.warnings);
    }
  }

  /**
   * Hook para validar después de la extracción
   */
  async afterExtract(extractedFiles: string[]): Promise<void> {
    // Verificar que no se hayan creado archivos peligrosos
    const dangerousFiles = extractedFiles.filter(file => this.isDangerousFile(file));

    if (dangerousFiles.length > 0) {
      console.error('Archivos peligrosos detectados después de extracción:', dangerousFiles);
      // Aquí se podría implementar rollback o eliminación
    }
  }

  private isDangerousFile(filePath: string): boolean {
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

// Exportar singleton para uso global
export const secureTarHandler = new SecureTarHandler();
export const tarSecurityMiddleware = new TarSecurityMiddleware();
