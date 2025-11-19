#!/usr/bin/env node

/**
 * Script para actualizar importaciones relativas agregando extensión .js
 * Necesario para moduleResolution: "NodeNext" en TypeScript
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Colores para output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Configuración
const config = {
  // Directorios a procesar
  targetDirs: [
    'apps/payment-service/src',
    // Agrega más directorios según necesites
  ],
  // Extensiones de archivo a procesar
  fileExtensions: ['ts', 'tsx'],
  // Patrones a excluir
  excludePatterns: [
    '**/node_modules/**',
    '**/*.spec.ts',
    '**/*.test.ts',
    '**/*.d.ts',
    '**/dist/**'
  ]
};

// Contador de cambios
let totalFiles = 0;
let modifiedFiles = 0;
let totalImports = 0;

/**
 * Procesa un archivo y actualiza las importaciones
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fileImports = 0;

  // Regex para encontrar importaciones relativas sin extensión .js
  // Captura: import/export ... from './path' (sin .js al final)
  const importRegex = /((?:import|export)\s+.*?\s+from\s+['"])(\.[^'"]+?)(?<!\.js)(['"])/g;

  const newContent = content.replace(importRegex, (match, prefix, importPath, suffix) => {
    // Verificar si es una importación relativa y no tiene ya .js
    if (importPath.startsWith('.') && !importPath.endsWith('.js')) {
      modified = true;
      fileImports++;
      return `${prefix}${importPath}.js${suffix}`;
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    modifiedFiles++;
    totalImports += fileImports;
    console.log(`${colors.green}✓${colors.reset} ${path.relative(process.cwd(), filePath)} - ${fileImports} importaciones actualizadas`);
  }

  totalFiles++;
}

/**
 * Busca archivos TypeScript en el directorio especificado
 */
function findTypeScriptFiles(dir) {
  const patterns = config.fileExtensions.map(ext => path.join(dir, `**/*.${ext}`));
  const files = [];

  patterns.forEach(pattern => {
    const found = glob.sync(pattern, {
      ignore: config.excludePatterns,
      absolute: true
    });
    files.push(...found);
  });

  return files;
}

/**
 * Función principal
 */
function main() {
  console.log(`${colors.blue}🔧 Actualizando importaciones para moduleResolution: NodeNext${colors.reset}\n`);

  // Verificar si se pasó un directorio como argumento
  const customDir = process.argv[2];
  const dirsToProcess = customDir ? [customDir] : config.targetDirs;

  dirsToProcess.forEach(dir => {
    const fullPath = path.resolve(dir);

    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.red}❌ Directorio no encontrado: ${dir}${colors.reset}`);
      return;
    }

    console.log(`${colors.yellow}📁 Procesando: ${dir}${colors.reset}`);
    const files = findTypeScriptFiles(fullPath);

    files.forEach(file => {
      processFile(file);
    });

    console.log('');
  });

  // Resumen
  console.log(`${colors.blue}📊 Resumen:${colors.reset}`);
  console.log(`   Total de archivos procesados: ${totalFiles}`);
  console.log(`   Archivos modificados: ${colors.green}${modifiedFiles}${colors.reset}`);
  console.log(`   Importaciones actualizadas: ${colors.green}${totalImports}${colors.reset}`);

  if (modifiedFiles > 0) {
    console.log(`\n${colors.yellow}⚠️  Recuerda:${colors.reset}`);
    console.log('   1. Revisar los cambios con git diff');
    console.log('   2. Ejecutar los tests para verificar que todo funciona');
    console.log('   3. Compilar el proyecto (pnpm build)');
  }
}

// Verificar si glob está instalado
try {
  require.resolve('glob');
} catch (e) {
  console.error(`${colors.red}❌ Error: El paquete 'glob' no está instalado.${colors.reset}`);
  console.error(`   Ejecuta: npm install -g glob`);
  console.error(`   O: pnpm add -D glob`);
  process.exit(1);
}

// Ejecutar
main();
