# 📋 PLAN DE ACCIÓN EJECUTABLE
## Proyecto: A4CO DDD Microservices → Production Ready

**Generado**: 7 Diciembre 2025  
**Base**: Auditoría Arquitectónica Completa  
**Objetivo**: Llevar el proyecto de 58% completitud a 95% production-ready  
**Timeline Estimado**: 2-3 meses (equipo de 3 developers senior)

---

## 🎯 RESUMEN EJECUTIVO DEL PLAN

### Fases del Roadmap

```
FASE 0: Estabilización Urgente        [5 días]   ← CRÍTICO
FASE 1: Fundamentos Sólidos           [3 semanas]
FASE 2: Arquitectura Completa         [4 semanas]
FASE 3: Testing & Calidad             [3 semanas]  
FASE 4: Producción & Optimización     [2 semanas]
────────────────────────────────────────────────
TOTAL:                                ~12 semanas
```

### Distribución de Esfuerzo por Equipo

| Developer | Especialización | Fases Principales |
|-----------|----------------|-------------------|
| **Dev A** | Backend/Infra | 0, 1, 2, 4 |
| **Dev B** | Frontend/API | 0, 1, 2, 4 |
| **Dev C** | Testing/QA | 0, 3, 4 |

---

## ⚡ FASE 0: ESTABILIZACIÓN URGENTE
### Duración: 5 días | Prioridad: 🔴 CRÍTICA

**Objetivo**: Desbloquear el proyecto para permitir trabajo paralelo.

### 📌 Tareas Críticas

#### Tarea 0.1: Fix Build Roto de dashboard-client
**Responsable**: Dev B  
**Estimación**: 2-3 horas  

**Problema**: Tailwind CSS class `ring-border/50` no existe

**Solución**:
```javascript
// OPCIÓN 1: Ajustar packages/design-system/tailwind.preset.js
colors: {
  // ... existing
  'ring-border': 'var(--border)', // ← AGREGAR ESTA LÍNEA
}

// OPCIÓN 2 (MEJOR): Buscar y reemplazar en código
// ring-border/50 → border/50 (ya existe)
```

**Comandos**:
```bash
cd apps/dashboard-client
grep -r "ring-border" . --include="*.tsx" --include="*.ts"
# Reemplazar manualmente o con sed:
find . -name "*.tsx" -exec sed -i 's/ring-border/border/g' {} \;

# Validar:
pnpm build
```

**Criterio de Aceptación**:
- [ ] `pnpm --filter dashboard-client build` ejecuta sin errores
- [ ] Build genera `.next/` válido
- [ ] `pnpm --filter dashboard-client dev` levanta en http://localhost:3001

---

#### Tarea 0.2: Reparar CI/CD Pipeline
**Responsable**: Dev A  
**Estimación**: 4-6 horas

**Problema**: Pipeline tolera errores con `|| echo "warning"`

**Acciones**:
```yaml
# .github/workflows/ci.yml

# ❌ ELIMINAR todos los || echo:
# ANTES:
pnpm run lint || echo "Lint warning"
pnpm run build || echo "Build warnings"

# ✅ DESPUÉS:
pnpm run lint
pnpm run build

# AGREGAR validación real:
- name: Validate builds
  run: |
    # Verificar que builds produjeron archivos
    test -d apps/dashboard-client/.next || exit 1
    test -d apps/order-service/dist || exit 1
    test -d apps/payment-service/dist || exit 1
    
- name: Run critical tests
  run: |
    pnpm --filter @a4co/order-service test --passWithNoTests
    pnpm --filter @a4co/payment-service test --passWithNoTests
```

**Criterio de Aceptación**:
- [ ] Pipeline FALLA si build real falla
- [ ] Tests unitarios se ejecutan (aunque sea con --passWithNoTests temporalmente)
- [ ] Al menos 1 ejecución verde completa del pipeline

---

#### Tarea 0.3: Sincronizar Versiones de Prisma
**Responsable**: Dev A  
**Estimación**: 1 hora

**Problema**: `prisma@5.22.0` vs `@prisma/client@6.19.0` (incompatibles)

**Solución**:
```bash
# Unificar a 6.19.0
pnpm add -w prisma@6.19.0 @prisma/client@6.19.0
pnpm update prisma @prisma/client -r

# Regenerar clients en cada servicio
pnpm --filter @a4co/order-service prisma generate
pnpm --filter @a4co/payment-service prisma generate
pnpm --filter @a4co/inventory-service prisma generate

# Verificar versión
pnpm --filter @a4co/order-service prisma --version
```

**Criterio de Aceptación**:
- [ ] No warnings de versión en `pnpm install`
- [ ] Todos los servicios usan Prisma 6.19.0
- [ ] Clientes Prisma regenerados sin errores

---

#### Tarea 0.4: Limpiar pnpm Workspace
**Responsable**: Dev A  
**Estimación**: 30 minutos

**Problema**: `pnpm-workspace.yaml` tiene entries inexistentes

**Solución**:
```yaml
# pnpm-workspace.yaml - LIMPIAR A:
packages:
  - 'apps/*'
  - 'packages/*'
  # ❌ ELIMINAR: infra, frontend, backend, frontend-monolith
```

**Criterio de Aceptación**:
- [ ] `pnpm install` sin warnings de workspaces
- [ ] Todos los paquetes detectados correctamente

---

#### Tarea 0.5: Decisión sobre Servicios Stub
**Responsable**: Tech Lead + Team  
**Estimación**: 1 hora (reunión + ADR)

**Servicios vacíos**: admin, analytics, artisan, chat, cms, event

**Recomendación**: **ELIMINAR** stub services no prioritarios

**Documentar**:
```markdown
# docs/architecture/adr/004-remove-stub-services.md

## Context
6 servicios (admin, analytics, artisan, chat, cms, event) están vacíos.

## Decision
ELIMINAR estos servicios del monorepo por YAGNI principle.

## Consequences
- Foco en 8 servicios funcionales
- Reducción de complejidad
- Si se necesitan en futuro: re-crear desde template

## Status
ACCEPTED
```

**Criterio de Aceptación**:
- [ ] ADR creado y aprobado
- [ ] Si ELIMINAR: commits de eliminación + README actualizado
- [ ] Si MANTENER: package.json mínimo + docs/roadmap.md

---

### 🎁 Entregables de Fase 0

1. ✅ dashboard-client build funcional
2. ✅ CI/CD pipeline confiable
3. ✅ Prisma sincronizado
4. ✅ Workspace limpio
5. ✅ ADR sobre servicios stub
6. ✅ README.md con comandos correctos

---

## 🏗️ FASE 1: FUNDAMENTOS SÓLIDOS  
### Duración: 3 semanas | Prioridad: 🟡 ALTA

**Objetivo**: Establecer bases arquitectónicas para crecimiento.

### Tareas Principales

#### 1.1: Implementar API Gateway (NestJS)
- Proxy a microservicios
- JWT validation
- Rate limiting
- **Estimación**: 3-4 días

#### 1.2: Event Bus con NATS
- Desacoplar servicios HTTP → Event-driven
- Saga pattern mejorado
- **Estimación**: 2-3 días

#### 1.3: SDK @a4co/api-client
- Frontend consume backend via SDK tipado
- Error handling unificado
- **Estimación**: 2 días

#### 1.4: Consolidar Documentación
- docs/ organizado
- ADRs creados
- **Estimación**: 1 día

---

## 🚀 FASE 2: ARQUITECTURA COMPLETA
### Duración: 4 semanas | Prioridad: 🟡 ALTA

### Tareas Principales

#### 2.1: Saga Orchestrator Robusto
- Retry logic
- Timeout handling
- Compensación automática
- **Estimación**: 5 días

#### 2.2: Refactor de Seguridad
- Secrets → variables de entorno
- Refresh tokens
- Rate limiting por usuario
- **Estimación**: 3-4 días

#### 2.3: Frontend Integration
- Auth context con refresh
- React Query
- Error handling UI
- **Estimación**: 1 semana

---

## 🧪 FASE 3: TESTING & CALIDAD
### Duración: 3 semanas | Prioridad: 🟢 MEDIA-ALTA

### Tareas Principales

#### 3.1: Unit Tests (Domain Layer)
- Target: 80% coverage en domain/
- **Estimación**: 1 semana

#### 3.2: Integration Tests
- Testcontainers + Repositories
- **Estimación**: 4 días

#### 3.3: E2E Tests (Playwright)
- Flujos críticos completos
- **Estimación**: 1 semana

#### 3.4: Coverage en CI
- Codecov integration
- Pipeline falla si < 70%
- **Estimación**: 1 día

---

## 🏁 FASE 4: PRODUCCIÓN & OPTIMIZACIÓN
### Duración: 2 semanas | Prioridad: 🟢 MEDIA

### Tareas Principales

#### 4.1: Multi-Stage Docker
- Imágenes de producción < 200MB
- **Estimación**: 2 días

#### 4.2: Terraform ECS Fargate
- Cluster + Auto-scaling
- **Estimación**: 3 días

#### 4.3: Observabilidad Completa
- Logs + Metrics + Traces
- Grafana dashboards
- **Estimación**: 3 días

#### 4.4: Pre-Production Checklist
- Security audit
- Load testing
- **Estimación**: 1 día

---

## 📊 MÉTRICAS DE ÉXITO

### DORA Metrics Targets

| Métrica | Actual | Target |
|---------|--------|--------|
| Deployment Frequency | Manual | 1x/día |
| Lead Time | ? | < 1h |
| Time to Restore | ? | < 15min |
| Change Failure Rate | 100% | < 15% |

### Code Quality

| Métrica | Actual | Target |
|---------|--------|--------|
| Coverage | ? | 70%+ |
| Linting Errors | Muchos | 0 |
| Security Vulns (high) | ? | 0 |

---

## ✅ CRITERIOS DE FINALIZACIÓN

Proyecto **Production-Ready** cuando:

1. ✅ Build exitoso en CI (verde)
2. ✅ 70%+ test coverage
3. ✅ 0 vulnerabilidades high
4. ✅ Gateway funcional
5. ✅ Event-driven implementado
6. ✅ Frontend integrado
7. ✅ Deployado en ECS
8. ✅ Observabilidad completa
9. ✅ Load testing pasado (1000 req/s)
10. ✅ Docs actualizadas

---

**Siguiente Paso**: Ver `CHECKLIST_VSCODE.md` para ejecución inmediata
