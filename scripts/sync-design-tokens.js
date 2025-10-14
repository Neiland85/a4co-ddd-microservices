#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Rutas del Design System
const DESIGN_SYSTEM_PATH = path.join(__dirname, '../packages/design-system');
const TOKENS_PATH = path.join(DESIGN_SYSTEM_PATH, 'src/tokens');
const TAILWIND_PRESET_PATH = path.join(DESIGN_SYSTEM_PATH, 'tailwind.preset.js');

// Apps que necesitan sincronización
const APPS_TO_SYNC = [
  'apps/web/v0dev/a-head',
  'apps/web/v0dev/b-business-registration',
  'apps/web/v0dev/c-artisan-dashboard',
  'apps/web/v0dev/d-user-registration',
  'apps/web/v0dev/e-gamified-dashboard',
  'apps/web/v0dev/f-modern-backoffice',
  'apps/web/v0dev/g-banner-cookie',
  'apps/dashboard-web',
];

// Función para notificar cambios
function notify(message, type = 'info') {
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  console.log(`${icon} ${chalk.bold(message)}`);
}

// Función para sincronizar tokens
async function syncTokens() {
  notify('Sincronizando tokens de diseño...', 'info');

  try {
    // Reconstruir el Design System
    execSync('pnpm --filter @a4co/design-system build', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });

    // Invalidar cache de require para el preset
    delete require.cache[require.resolve(TAILWIND_PRESET_PATH)];

    // Notificar a las apps para que recarguen
    for (const app of APPS_TO_SYNC) {
      const appPath = path.join(__dirname, '..', app);
      const touchFile = path.join(appPath, 'tailwind.config.ts');

      if (fs.existsSync(touchFile)) {
        // Touch el archivo para forzar recarga
        const now = new Date();
        fs.utimesSync(touchFile, now, now);
        notify(`Actualizado: ${app}`, 'success');
      }
    }

    notify('✨ Tokens sincronizados exitosamente', 'success');
  } catch (error) {
    notify(`Error al sincronizar: ${error.message}`, 'error');
  }
}

// Función para watch mode
function watchTokens() {
  notify('👀 Observando cambios en el Design System...', 'info');

  const watcher = chokidar.watch(
    [
      path.join(TOKENS_PATH, '**/*.ts'),
      path.join(DESIGN_SYSTEM_PATH, 'src/styles/**/*.css'),
      TAILWIND_PRESET_PATH,
    ],
    {
      persistent: true,
      ignoreInitial: true,
<<<<<<< HEAD
    },
=======
    }
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  let syncTimeout;

  watcher.on('all', (event, filePath) => {
    const relativePath = path.relative(DESIGN_SYSTEM_PATH, filePath);
    notify(`Cambio detectado: ${relativePath}`, 'info');

    // Debounce para evitar múltiples sincronizaciones
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      syncTokens();
    }, 300);
  });

  watcher.on('error', error => {
    notify(`Error en watcher: ${error}`, 'error');
  });

  // Manejar cierre graceful
  process.on('SIGINT', () => {
    notify('Deteniendo observador...', 'info');
    watcher.close();
    process.exit(0);
  });
}

// CLI
const command = process.argv[2];

switch (command) {
  case 'watch':
    watchTokens();
    break;
  case 'sync':
    syncTokens().then(() => process.exit(0));
    break;
  default:
    console.log(`
${chalk.bold('Design System Token Sync')}

Uso:
  ${chalk.cyan('node scripts/sync-design-tokens.js [comando]')}

Comandos:
  ${chalk.green('sync')}   - Sincroniza tokens una vez
  ${chalk.green('watch')}  - Observa cambios y sincroniza automáticamente

Ejemplos:
  ${chalk.gray('# Sincronizar una vez')}
  pnpm design:sync

  ${chalk.gray('# Watch mode')}
  pnpm design:sync:watch
    `);
    process.exit(1);
}

// Exportar funciones para uso programático
module.exports = {
  syncTokens,
  watchTokens,
};
