#!/usr/bin/env node

/**
 * Script de extracción segura de archivos tar
 * Uso: node scripts/extract-tar-secure.js <ruta-tar> <directorio-destino> [--sandbox]
 */

const { secureTarHandler } = require('../packages/shared-utils/dist/src/security/tar-security.js');

async function main() {
  const [, , tarPath, targetDir, ...args] = process.argv;

  if (!tarPath || !targetDir) {
    console.error(
      'Uso: node scripts/extract-tar-secure.js <ruta-tar> <directorio-destino> [--sandbox]'
    );
    process.exit(1);
  }

  const useSandbox = args.includes('--sandbox');

  console.log(`🔒 Extrayendo archivo tar de forma segura:`);
  console.log(`   Origen: ${tarPath}`);
  console.log(`   Destino: ${targetDir}`);
  console.log(`   Sandbox: ${useSandbox ? 'SÍ' : 'NO'}`);
  console.log('='.repeat(60));

  try {
    const result = await secureTarHandler.extractSecurely(tarPath, targetDir, {
      createSandbox: useSandbox,
      validateChecksum: false, // Por ahora, sin checksum
    });

    if (result.success) {
      console.log('✅ Extracción completada exitosamente');
      console.log(`📁 Archivos extraídos: ${result.extractedFiles.length}`);

      if (result.extractedFiles.length > 0) {
        console.log('\nArchivos extraídos:');
        result.extractedFiles.slice(0, 10).forEach(file => {
          console.log(`  - ${file}`);
        });

        if (result.extractedFiles.length > 10) {
          console.log(`  ... y ${result.extractedFiles.length - 10} archivos más`);
        }
      }
    } else {
      console.log('❌ Extracción fallida');
      console.log('\nErrores:');
      result.errors.forEach(error => console.log(`  - ${error}`));
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error durante extracción:', error.message);
    process.exit(1);
  }
}

main();
