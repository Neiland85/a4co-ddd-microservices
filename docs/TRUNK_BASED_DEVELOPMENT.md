# 🌳 Trunk-Based Development Guidelines

## 🎯 Principios

Trunk-Based Development (TBD) es una práctica donde todos los desarrolladores trabajan en una única rama compartida (trunk/main), creando ramas cortas solo cuando es necesario.

### Beneficios

- 🚀 **Deployments más rápidos**: Menos conflictos de merge
- 🔒 **Mejor calidad**: Tests constantes en rama principal
- 👥 **Colaboración**: Trabajo en equipo más fluido
- 📊 **Métricas DORA**: Mejora automática de todas las métricas

## 🚀 Flujo de Trabajo

### 1. Trabajo Diario

```bash
# Actualizar rama principal
git checkout main
git pull origin main

# Crear rama corta para feature (opcional, < 1 día)
git checkout -b feature/short-description
```

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

```typescript
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
```

### Flags Disponibles

- `NEW_DASHBOARD`: Nuevo dashboard con métricas DORA
- `ADVANCED_ANALYTICS`: Análisis avanzado de rendimiento
- `AI_SUGGESTIONS`: Sugerencias basadas en IA
- `LAZY_LOADING`: Carga diferida de componentes

## 🔄 Git Workflow Optimizado

### Comandos Útiles

```bash
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
```

### Estrategia de Ramas

- `main`: Rama de producción, siempre deployable
- `develop`: Rama de desarrollo (opcional para equipos grandes)
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

- Push a `main` → Deploy automático a staging
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

```bash
# Calcular métricas DORA
pnpm run dora:calculate

# Ver dashboard
pnpm run dora:dashboard

# Reporte de cobertura
pnpm run test:coverage-report
```

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

```bash
git fetch origin
git reset --hard origin/main
```

### Conflicto de Merge

```bash
# Revertir y hacer cambios más pequeños
git revert HEAD
# O resolver conflictos manualmente
git mergetool
```

### Feature Flag Problemático

```bash
# Deshabilitar temporalmente
# Contactar al administrador para toggle
```

---

_Guías actualizadas automáticamente - Última actualización: 2025-09-29_
