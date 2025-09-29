#!/usr/bin/env node

/**
 * Wrapper script para ejecutar la validación de braces en todo el proyecto
 */

const { spawn } = require('child_process');
const path = require('path');

// Ruta al script compilado
const scriptPath = path.join(
  __dirname,
  'packages/shared-utils/dist/src/security/validate-braces-security.js'
);

// Ejecutar el script con todos los argumentos pasados
const child = spawn('node', [scriptPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: __dirname,
});

child.on('exit', code => {
  process.exit(code);
});

child.on('error', error => {
  console.error('Error ejecutando el script de validación:', error);
  process.exit(1);
});
