#!/usr/bin/env node

/**
 * Trunk-Based Development Setup
 * Configura desarrollo basado en trunk con feature flags
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TrunkBasedDevelopmentSetup {
  constructor() {
    // Siempre usar el directorio raíz del proyecto monorepo
    this.projectRoot = path.resolve('/Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices');
  }

  /**
   * Configura trunk-based development
   */
  async setupTrunkBasedDevelopment() {
    console.log('🌳 Configurando Trunk-Based Development...\n');

    try {
      await this.configureGitFlow();
      await this.setupFeatureFlags();
      await this.configureBranchProtection();
      await this.setupAutomatedReleases();
      await this.createDevelopmentGuidelines();

      console.log('✅ Trunk-Based Development configurado!');
    } catch (error) {
      console.error('❌ Error configurando trunk-based development:', error.message);
      process.exit(1);
    }
  }

  /**
   * Configura flujo de Git optimizado
   */
  async configureGitFlow() {
    console.log('🔄 Configurando flujo de Git optimizado...');

    // Crear rama develop si no existe
    try {
      execSync('git show-ref --verify --quiet refs/heads/develop', { stdio: 'pipe' });
      console.log('  ✅ Rama develop ya existe');
    } catch (error) {
      console.log('  📍 Creando rama develop...');
      execSync('git checkout -b develop');
      execSync('git checkout main');
    }

    // Configurar Git para trunk-based
    const gitConfig = `
[alias]
    # Comandos optimizados para trunk-based
    trunk-status = !git status --short --branch
    trunk-log = !git log --oneline --graph --decorate -10
    trunk-diff = !git diff main..HEAD
    trunk-merge = !git checkout main && git pull && git merge develop --no-ff
    trunk-release = !git tag -a $(date +%Y.%m.%d) -m "Release $(date +%Y-%m-%d)"

[merge]
    ff = only

[push]
    default = simple

[core]
    editor = code --wait
`;

    const gitConfigPath = path.join(this.projectRoot, '.gitconfig');
    fs.writeFileSync(gitConfigPath, gitConfig);
    console.log('  ✅ Configuración de Git optimizada');
  }

  /**
   * Configura feature flags
   */
  async setupFeatureFlags() {
    console.log('🚩 Configurando Feature Flags...');

    // Crear sistema de feature flags
    const featureFlagsDir = path.join(this.projectRoot, 'packages', 'feature-flags');
    if (!fs.existsSync(featureFlagsDir)) {
      fs.mkdirSync(featureFlagsDir, { recursive: true });
    }

    // Crear servicio de feature flags
    const featureFlagService = this.generateFeatureFlagService();
    fs.writeFileSync(path.join(featureFlagsDir, 'feature-flag.service.ts'), featureFlagService);

    // Crear módulo de feature flags
    const featureFlagModule = this.generateFeatureFlagModule();
    fs.writeFileSync(path.join(featureFlagsDir, 'feature-flag.module.ts'), featureFlagModule);

    // Crear configuración de flags
    const flagsConfig = this.generateFlagsConfig();
    fs.writeFileSync(path.join(featureFlagsDir, 'flags.config.ts'), flagsConfig);

    console.log('  ✅ Sistema de Feature Flags creado');
  }

  /**
   * Genera servicio de feature flags
   */
  generateFeatureFlagService() {
    return `import { Injectable } from '@nestjs/common';
import { FLAGS_CONFIG } from './flags.config';

@Injectable()
export class FeatureFlagService {
  private flags: Map<string, boolean> = new Map();

  constructor() {
    this.initializeFlags();
  }

  private initializeFlags() {
    // En producción, esto vendría de una base de datos o servicio externo
    Object.entries(FLAGS_CONFIG).forEach(([key, config]) => {
      this.flags.set(key, process.env.NODE_ENV === 'production' ?
        config.production : config.development);
    });
  }

  isEnabled(flagName: string): boolean {
    return this.flags.get(flagName) ?? false;
  }

  getAllFlags(): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    this.flags.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  // Método para toggles administrativos
  toggleFlag(flagName: string, enabled: boolean): void {
    if (this.flags.has(flagName)) {
      this.flags.set(flagName, enabled);
      console.log(\`🚩 Feature flag '\${flagName}' \${enabled ? 'enabled' : 'disabled'}\`);
    }
  }
}
`;
  }

  /**
   * Genera módulo de feature flags
   */
  generateFeatureFlagModule() {
    return `import { Module } from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';

@Module({
  providers: [FeatureFlagService],
  exports: [FeatureFlagService],
})
export class FeatureFlagModule {}
`;
  }

  /**
   * Genera configuración de flags
   */
  generateFlagsConfig() {
    return `export interface FlagConfig {
  development: boolean;
  production: boolean;
  description: string;
}

export const FLAGS_CONFIG: Record<string, FlagConfig> = {
  // Nuevas funcionalidades
  NEW_DASHBOARD: {
    development: true,
    production: false,
    description: 'Nuevo dashboard con métricas DORA'
  },

  ADVANCED_ANALYTICS: {
    development: true,
    production: false,
    description: 'Análisis avanzado de rendimiento'
  },

  // Funcionalidades experimentales
  AI_SUGGESTIONS: {
    development: true,
    production: false,
    description: 'Sugerencias basadas en IA'
  },

  // Optimizaciones de rendimiento
  LAZY_LOADING: {
    development: true,
    production: true,
    description: 'Carga diferida de componentes'
  },

  // Integraciones
  THIRD_PARTY_INTEGRATIONS: {
    development: true,
    production: false,
    description: 'Integraciones con servicios externos'
  }
};

// Helper para verificar flags en código
export const isFlagEnabled = (flagName: string): boolean => {
  const flag = FLAGS_CONFIG[flagName];
  if (!flag) return false;

  return process.env.NODE_ENV === 'production' ?
    flag.production : flag.development;
};
`;
  }

  /**
   * Configura protección de ramas
   */
  async configureBranchProtection() {
    console.log('🔒 Configurando protección de ramas...');

    const branchProtection = {
      required_status_checks: {
        strict: true,
        contexts: [
          'test',
          'lint',
          'security-audit',
          'dora-metrics'
        ]
      },
      required_pull_request_reviews: {
        required_approving_review_count: 1,
        dismiss_stale_reviews: true,
        require_code_owner_reviews: true
      },
      restrictions: null,
      enforce_admins: false,
      allow_force_pushes: false,
      allow_deletions: false
    };

    const protectionPath = path.join(this.projectRoot, '.github', 'branch-protection.json');
    fs.writeFileSync(protectionPath, JSON.stringify(branchProtection, null, 2));

    console.log('  ✅ Configuración de protección de ramas creada');
  }

  /**
   * Configura releases automatizados
   */
  async setupAutomatedReleases() {
    console.log('🚀 Configurando releases automatizados...');

    const releaseWorkflow = this.generateReleaseWorkflow();
    const releasePath = path.join(this.projectRoot, '.github', 'workflows', 'release.yml');
    fs.writeFileSync(releasePath, releaseWorkflow);

    // Crear configuración de semantic versioning
    const semanticConfig = {
      branches: {
        main: { prerelease: false },
        develop: { prerelease: 'beta' }
      },
      plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        '@semantic-release/git',
        '@semantic-release/github'
      ]
    };

    const semanticPath = path.join(this.projectRoot, '.releaserc.json');
    fs.writeFileSync(semanticPath, JSON.stringify(semanticConfig, null, 2));

    console.log('  ✅ Releases automatizados configurados');
  }

  /**
   * Genera workflow de release
   */
  generateReleaseWorkflow() {
    return `name: Release

on:
  push:
    branches: [ main, develop ]
  workflow_dispatch:

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Run tests
      run: pnpm run test

    - name: Build
      run: pnpm run build

    - name: Calculate DORA metrics
      run: pnpm run dora:calculate

    - name: Release
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        NPM_TOKEN: \${{ secrets.NPM_TOKEN }}
      run: npx semantic-release
`;
  }

  /**
   * Crea guías de desarrollo
   */
  async createDevelopmentGuidelines() {
    console.log('📚 Creando guías de desarrollo...');

    const guidelines = this.generateDevelopmentGuidelines();
    const guidelinesPath = path.join(this.projectRoot, 'docs', 'TRUNK_BASED_DEVELOPMENT.md');
    fs.writeFileSync(guidelinesPath, guidelines);

    console.log('  ✅ Guías de desarrollo creadas');
  }

  /**
   * Genera guías de desarrollo trunk-based
   */
  generateDevelopmentGuidelines() {
    return `# 🌳 Trunk-Based Development Guidelines

## 🎯 Principios

Trunk-Based Development (TBD) es una práctica donde todos los desarrolladores trabajan en una única rama compartida (trunk/main), creando ramas cortas solo cuando es necesario.

### Beneficios
- 🚀 **Deployments más rápidos**: Menos conflictos de merge
- 🔒 **Mejor calidad**: Tests constantes en rama principal
- 👥 **Colaboración**: Trabajo en equipo más fluido
- 📊 **Métricas DORA**: Mejora automática de todas las métricas

## 🚀 Flujo de Trabajo

### 1. Trabajo Diario
\`\`\`bash
# Actualizar rama principal
git checkout main
git pull origin main

# Crear rama corta para feature (opcional, < 1 día)
git checkout -b feature/short-description
\`\`\`

### 2. Commits Frecuentes
- Commits pequeños y frecuentes
- Cada commit debe pasar todos los tests
- Mensajes descriptivos siguiendo conventional commits

### 3. Integración Continua
- Push frecuente a rama principal
- CI/CD ejecuta automáticamente tests y despliegue
- Feature flags para funcionalidades no listas

## 🚩 Feature Flags

### Uso Básico
\`\`\`typescript
import { FeatureFlagService } from '@a4co/feature-flags';

@Injectable()
export class MyService {
  constructor(private featureFlags: FeatureFlagService) {}

  myMethod() {
    if (this.featureFlags.isEnabled('NEW_DASHBOARD')) {
      // Nueva funcionalidad
      return this.newDashboardLogic();
    } else {
      // Funcionalidad antigua
      return this.oldDashboardLogic();
    }
  }
}
\`\`\`

### Flags Disponibles
- \`NEW_DASHBOARD\`: Nuevo dashboard con métricas DORA
- \`ADVANCED_ANALYTICS\`: Análisis avanzado de rendimiento
- \`AI_SUGGESTIONS\`: Sugerencias basadas en IA
- \`LAZY_LOADING\`: Carga diferida de componentes

## 🔄 Git Workflow Optimizado

### Comandos Útiles
\`\`\`bash
# Ver estado del trunk
git trunk-status

# Ver historial gráfico
git trunk-log

# Ver diferencias con main
git trunk-diff

# Merge a main (desde develop)
git trunk-merge

# Crear release
git trunk-release
\`\`\`

### Estrategia de Ramas
- \`main\`: Rama de producción, siempre deployable
- \`develop\`: Rama de desarrollo (opcional para equipos grandes)
- Ramas cortas: Solo cuando es estrictamente necesario

## 📋 Pull Requests

### Checklist Antes de PR
- [ ] Tests pasan localmente
- [ ] Cobertura > 70%
- [ ] Linting sin errores
- [ ] Feature flags implementados si es necesario
- [ ] Documentación actualizada

### Revisión de Código
- Aprobación requerida: 1 reviewer
- Checks requeridos: tests, lint, security
- Tamaño máximo: 500 líneas cambiadas

## 🚀 Deployment

### Automático
- Push a \`main\` → Deploy automático a staging
- Tag de release → Deploy a producción
- Rollback automático si falla

### Manual (Excepcional)
Solo para emergencias críticas con aprobación del tech lead.

## 📊 Monitoreo

### Métricas a Seguir
- **Deployment Frequency**: > 1/día (objetivo)
- **Lead Time**: < 1 hora (objetivo)
- **Change Failure Rate**: < 15% (objetivo)
- **Time to Restore**: < 1 hora (objetivo)

### Comandos de Monitoreo
\`\`\`bash
# Calcular métricas DORA
pnpm run dora:calculate

# Ver dashboard
pnpm run dora:dashboard

# Reporte de cobertura
pnpm run test:coverage-report
\`\`\`

## 🎖️ Mejores Prácticas

### 1. Commits Pequeños
- Máximo 1 funcionalidad por commit
- Tests incluidos en el mismo commit
- Mensajes claros y descriptivos

### 2. Feature Flags
- Usar para funcionalidades no completas
- Remover flags obsoletos regularmente
- Documentar propósito de cada flag

### 3. Code Reviews
- Revisar código, no personas
- Enfocarse en mantenibilidad y testabilidad
- Aprobar solo código que cumpla estándares

### 4. Testing
- Tests unitarios para lógica compleja
- Tests de integración para APIs
- Tests E2E para flujos críticos

## 🆘 Solución de Problemas

### Rama Desincronizada
\`\`\`bash
git fetch origin
git reset --hard origin/main
\`\`\`

### Conflicto de Merge
\`\`\`bash
# Revertir y hacer cambios más pequeños
git revert HEAD
# O resolver conflictos manualmente
git mergetool
\`\`\`

### Feature Flag Problemático
\`\`\`bash
# Deshabilitar temporalmente
# Contactar al administrador para toggle
\`\`\`

---

*Guías actualizadas automáticamente - Última actualización: ${new Date().toISOString().split('T')[0]}*
`;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const setup = new TrunkBasedDevelopmentSetup();
  setup.setupTrunkBasedDevelopment();
}

module.exports = TrunkBasedDevelopmentSetup;