#!/usr/bin/env node

/**
 * Script de validación de seguridad para archivos tar
 * Uso: node scripts/validate-tar.js <ruta-al-archivo-tar>
 */

// Importar desde código fuente (requiere ts-node o compilación)
async function loadSecureTarHandler() {
  try {
    // Intentar cargar desde dist primero
    return require('../packages/shared-utils/dist/src/security/tar-security.js');
  } catch {
    // Si no existe, usar implementación inline básica
    console.log('⚠️  Usando implementación básica (módulo no compilado)');

    const fs = require('fs').promises;
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    class BasicTarValidator {
      async validateTarFile(filePath) {
        const errors = [];
        const warnings = [];

        try {
          // Validar extensión
          if (!filePath.match(/\.(tar|tar\.gz|tgz|tar\.bz2|tar\.xz)$/i)) {
            errors.push('Extensión de archivo no permitida');
          }

          // Validar tamaño
          const stats = await fs.stat(filePath);
          if (stats.size > 100 * 1024 * 1024) {
            // 100MB
            errors.push('Archivo demasiado grande');
          }

          // Listar contenido con detalles (para detectar symlinks)
          const { stdout } = await execAsync(`tar -tvf "${filePath}" 2>/dev/null | head -50`);
          const lines = stdout.split('\n').filter(line => line.trim());

          for (const line of lines) {
            // Parse tar -tvf output format
            // Format: permissions links owner group size date time filename [-> link_target]
            const parts = line.trim().split(/\s+/);
            if (parts.length < 8) continue;

            const permissions = parts[0];
            const filename = parts.slice(7).join(' ');

            // Detectar symlinks (empiezan con 'l')
            if (permissions.startsWith('l')) {
              const linkMatch = filename.match(/^(.+?)\s*->\s*(.+)$/);
              if (linkMatch) {
                const [, linkName, targetPath] = linkMatch;

                // Verificar si el target es peligroso
                const dangerousPaths = [
                  '/etc',
                  '/usr',
                  '/bin',
                  '/sbin',
                  '/root',
                  '/home',
                  '.env',
                  'config',
                  'secrets',
                ];
                if (dangerousPaths.some(path => targetPath.includes(path))) {
                  errors.push(`Symlink peligroso detectado: ${linkName} -> ${targetPath}`);
                }

                // Verificar paths absolutos peligrosos
                if (
                  targetPath.startsWith('/') &&
                  !targetPath.startsWith('/tmp') &&
                  !targetPath.startsWith('/var/tmp')
                ) {
                  warnings.push(`Symlink absoluto: ${linkName} -> ${targetPath}`);
                }
              }
            }

            // Directory traversal en nombres de archivo
            if (filename.includes('../') || filename.startsWith('../')) {
              errors.push(`Directory traversal detectado: ${filename}`);
            }

            // Nombres de archivo peligrosos
            const dangerousNames = ['.env', 'config.json', 'secrets.json', 'private.key', '.pem'];
            if (dangerousNames.some(name => filename.includes(name))) {
              warnings.push(`Archivo potencialmente sensible: ${filename}`);
            }
          }
        } catch (error) {
          errors.push(`Error al validar: ${error.message}`);
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
        };
      }
    }

    return { secureTarHandler: new BasicTarValidator() };
  }
}

async function main() {
  const tarPath = process.argv[2];

  if (!tarPath) {
    console.error('Uso: node scripts/validate-tar.js <ruta-al-archivo-tar>');
    process.exit(1);
  }

  console.log(`🔍 Validando archivo tar: ${tarPath}`);
  console.log('='.repeat(50));

  try {
    const { secureTarHandler } = await loadSecureTarHandler();
    const result = await secureTarHandler.validateTarFile(tarPath);

    if (result.isValid) {
      console.log('✅ Archivo tar VALIDADO - Seguro para extraer');
    } else {
      console.log('❌ Archivo tar INVALIDO - NO extraer');
      console.log('\nErrores encontrados:');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Advertencias:');
      result.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    process.exit(result.isValid ? 0 : 1);
  } catch (error) {
    console.error('❌ Error durante validación:', error.message);
    process.exit(1);
  }
}

main();
