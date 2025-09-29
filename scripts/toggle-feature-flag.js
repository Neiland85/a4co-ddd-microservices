#!/usr/bin/env node

/**
 * Feature Flag Toggle Script
 * Permite activar/desactivar feature flags dinámicamente
 */

const fs = require('fs');
const path = require('path');

class FeatureFlagToggler {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'packages', 'feature-flags', 'flags.config.ts');
  }

  /**
   * Lista todos los feature flags disponibles
   */
  listFlags() {
    try {
      const configContent = fs.readFileSync(this.configPath, 'utf8');
      // Extraer el objeto FLAGS_CONFIG usando una expresión regular simple
      const flagsMatch = configContent.match(/FLAGS_CONFIG:\s*Record<string,\s*FlagConfig>\s*=\s*({[\s\S]*?});/);

      if (!flagsMatch) {
        console.error('❌ No se pudo encontrar la configuración de FLAGS_CONFIG');
        return;
      }

      console.log('🚩 Feature Flags Disponibles:\n');

      // Parsear manualmente los flags (ya que es TypeScript)
      const flagsText = flagsMatch[1];
      const flagRegex = /(\w+):\s*{[\s\S]*?description:\s*['"]([^'"]*)['"]/g;

      let match;
      while ((match = flagRegex.exec(flagsText)) !== null) {
        const flagName = match[1];
        const description = match[2];
        console.log(`  ${flagName}: ${description}`);
      }

    } catch (error) {
      console.error('❌ Error listando feature flags:', error.message);
    }
  }

  /**
   * Toggle un feature flag
   */
  toggleFlag(flagName, enabled = null) {
    try {
      let configContent = fs.readFileSync(this.configPath, 'utf8');

      // Si no se especifica enabled, alternar el estado actual
      if (enabled === null) {
        // Buscar el estado actual del flag
        const flagRegex = new RegExp(`${flagName}:\\s*{\\s*development:\\s*(true|false)`, 'i');
        const match = configContent.match(flagRegex);

        if (!match) {
          console.error(`❌ Feature flag '${flagName}' no encontrado`);
          return;
        }

        enabled = match[1] === 'false'; // Alternar el estado
      }

      // Actualizar el flag en development (para testing)
      const flagRegex = new RegExp(`(${flagName}:\\s*{[\\s\\S]*?development:\\s*)true`, 'i');
      const replacement = `$1${enabled}`;

      if (flagRegex.test(configContent)) {
        configContent = configContent.replace(flagRegex, replacement);
      } else {
        // Intentar con false
        const falseRegex = new RegExp(`(${flagName}:\\s*{[\\s\\S]*?development:\\s*)false`, 'i');
        configContent = configContent.replace(falseRegex, `$1${enabled}`);
      }

      fs.writeFileSync(this.configPath, configContent);

      console.log(`🚩 Feature flag '${flagName}' ${enabled ? 'activado' : 'desactivado'} en desarrollo`);

    } catch (error) {
      console.error('❌ Error toggling feature flag:', error.message);
    }
  }

  /**
   * Muestra ayuda
   */
  showHelp() {
    console.log(`
🚩 Feature Flag Toggler

Uso:
  pnpm run feature-flags:list                    # Lista todos los flags disponibles
  pnpm run feature-flags:toggle <flag> [true|false]  # Toggle un flag específico

Ejemplos:
  pnpm run feature-flags:list
  pnpm run feature-flags:toggle NEW_DASHBOARD
  pnpm run feature-flags:toggle ADVANCED_ANALYTICS true
  pnpm run feature-flags:toggle AI_SUGGESTIONS false

Flags disponibles:
  - NEW_DASHBOARD: Nuevo dashboard con métricas DORA
  - ADVANCED_ANALYTICS: Análisis avanzado de rendimiento
  - AI_SUGGESTIONS: Sugerencias basadas en IA
  - LAZY_LOADING: Carga diferida de componentes
  - THIRD_PARTY_INTEGRATIONS: Integraciones con servicios externos
`);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const toggler = new FeatureFlagToggler();

  switch (command) {
    case 'list':
      toggler.listFlags();
      break;
    case 'toggle':
      const flagName = args[1];
      const enabled = args[2] ? args[2].toLowerCase() === 'true' : null;
      if (!flagName) {
        console.error('❌ Debe especificar el nombre del feature flag');
        toggler.showHelp();
        process.exit(1);
      }
      toggler.toggleFlag(flagName, enabled);
      break;
    default:
      toggler.showHelp();
      break;
  }
}

module.exports = FeatureFlagToggler;