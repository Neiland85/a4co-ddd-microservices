## [v0.5.0-unification] - 2025-11-13

### 🔥 breaking

- **Reconciliación Estratégica de `main` y `develop`**: Se unificaron las ramas `main` y `develop`. La rama `main` se consolida como la única fuente de verdad, preservando las funcionalidades de producción y revirtiendo las simplificaciones extremas que se habían introducido en `develop`. Este cambio realinea la estrategia de desarrollo hacia un único flujo de trabajo basado en `main`.

### ✨ feat

- **Restauración del Saga Orchestrator**: Se ha restaurado por completo el orquestador de Sagas robusto (`OrderSagaOrchestrator`) de la rama `main`, incluyendo su lógica avanzada de estados, compensaciones, reintentos y timeouts. Se descarta la versión simplificada de `develop`.
- **Reintegración de Monitoreo Avanzado**: Se ha restaurado toda la infraestructura de monitoreo basada en Prometheus y Grafana, incluyendo el `SagaMetricsService` y los dashboards preconfigurados.

### 🔧 fix

- **Corrección de Tipado en Controlador**: Se ha corregido el tipado en `OrderController`, asegurando que el mapeo de `items` utilice el tipo `OrderItem` en lugar de `any` para mejorar la seguridad de tipos.
- **Eliminación de Código Duplicado**: Se eliminaron métodos duplicados (`getDomainEvents`, `clearDomainEvents`) en el agregado `Order`, consolidando la lógica en la clase base `AggregateRoot`.
- **Configuración de Tests de Vitest**: Se actualizó `vitest.config.ts` en `design-system` para incluir correctamente los archivos de test con extensiones `.tsx` y `.spec.tsx`.

### 📄 chore

- **Unificación del Logger**: Se ha consolidado y mejorado la implementación del logger en el paquete `observability`, estableciendo una única fuente de verdad y eliminando implementaciones redundantes.
- **Restauración de Tests E2E Críticos**: Se han restaurado los tests End-to-End para el flujo completo de la Saga y su lógica de compensación, asegurando la cobertura de los flujos de negocio más complejos.
- **Integración de Mejoras de `develop`**: Se han integrado selectivamente las actualizaciones de dependencias y las limpiezas de código menores que provenían de la rama `develop` y que no entraban en conflicto con las funcionalidades críticas.

### 📈 docs

- **Actualización del Changelog**: Se ha documentado el proceso de unificación de ramas en este `CHANGELOG.md`.

---

## [v0.4.0-dev-env] - 2025-07-15

### 📄 chore

- Se crea el workspace `a4co-ddd-microservices.code-workspace`
- Se configura `.vscode/settings.json`, `.copilot-chat.json`, `.extensions.json`
- Se elimina workspace anterior y MCPs conflictivos

### 📈 docs

- Publicado `README.md` actualizado con plan técnico (Fase 0 a 10)
- Documentación de entorno Copilot alineado a ADR-0010

---

# 📋 Obligaciones de Documentación de Cambios - Proyecto `a4co-ddd-microservices`

Este documento establece el estándar obligatorio para mantener un `CHANGELOG.md` profesional, semántico y alineado con las fases de desarrollo del proyecto.

---

## 🎯 Objetivo

Asegurar la trazabilidad de todos los cambios técnicos realizados en el proyecto, permitiendo:

- Comprensión rápida del estado del sistema por parte de cualquier colaborador
- Auditoría de decisiones técnicas alineadas a ADRs
- Automatización futura de releases y notas de versión

---

## 🧱 Estructura del `CHANGELOG.md`

Cada entrada debe seguir la siguiente estructura por versión:

### Formato de encabezado



```md
## [vX.Y.Z-nombre] - YYYY-MM-DD


```



### Categorías permitidas

- `### ✨ feat:` (features nuevas)
- `### 🔧 fix:` (bugs corregidos)
- `### 📄 chore:` (infraestructura, tooling, limpieza)
- `### 🔥 breaking:` (cambios que rompen compatibilidad)
- `### 📈 docs:` (documentación o planes técnicos)

Cada categoría puede contener una lista de bullets con cambios descriptivos.

---

## 🔁 Flujo de actualización

- Cada merge a `develop` **debe venir con una entrada en `CHANGELOG.md`** en la PR.
- El merge de `develop` a `main` **debe incluir un resumen agrupado** bajo un nuevo tag de versión (`vX.Y.Z`)
- Las entradas deben hacer referencia, cuando sea relevante, a:
  - ID del ADR afectado (`ADR-0012`)
  - ID de PR o commit
  - Nombre de rama si se trata de integraciones específicas

---

## 📂 Ubicación y versionado

- El archivo `CHANGELOG.md` estará ubicado en la raíz del repositorio
- Deberá estar versionado y actualizado en cada PR relevante
- Cambios no significativos podrán agruparse bajo entradas `chore:` si no modifican lógica funcional
