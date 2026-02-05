# Auditoría Técnica Senior (DDD + Hexagonal + Microservicios)

## 1. RESUMEN EJECUTIVO
- Estado real: **monorepo inconsistente** con servicios duplicados, carpetas vacías en rutas críticas y calidad de automatización degradada.
- Riesgo actual: **ALTO** para build, test y despliegue continuo.
- El proyecto **no cumple de forma homogénea** la arquitectura declarada (DDD + Hexagonal): hay un núcleo con intención correcta, pero convive con múltiples servicios plantilla/skeleton fuera de ese estándar.
- CI/CD efectivo en GitHub: **deshabilitado**.
- Build global: **fallando** por dependencias faltantes y errores de tipado en gateway.
- Test global: **fallando** por comando recursivo inválido para el conjunto real de workspaces.
- Deploy productivo: **frágil/inconsistente** por referencias a rutas legacy y coexistencia de estructuras paralelas.

## 2. INVENTARIO TÉCNICO

### Servicios funcionales (con estructura técnica real)
- `apps/services/order-service`: presenta capas `domain`, `application`, `infrastructure`, `presentation` y uso de eventos compartidos.
- `apps/services/auth-service`, `apps/services/payment-service`, `apps/services/inventory-service`, `apps/services/product-service`, `apps/services/user-service`: tienen `package.json`, scripts y estructura Nest utilizable.
- `apps/infrastructure/gateway` y `apps/infrastructure/notification-service`: existen como servicios Nest con scripts.

### Servicios incompletos
- Contextos de dominio pendientes explícitamente en `packages/domain` (`inventory`, `auth`, `user`, `product` comentados).
- `apps/services/order-service` depende de artefactos `dist` en paquetes compartidos (riesgo de build-order y fallo en limpio).
- `apps/frontend` compila, pero con `package.json` inconsistente (claves duplicadas en devDependencies).

### Servicios ruido / no productivos hoy
- Servicios tipo plantilla con lógica mock y sin infraestructura de ejecución propia: `apps/chat-service`, `apps/analytics-service`, `apps/artisan-service`, `apps/cms-service`, `apps/event-service`, `apps/geo-service`, `apps/loyalty-service`.
- Duplicidad de paquete `@a4co/shared-events` en dos rutas distintas (`packages/shared-events` y `packages/@a4co/shared-events`) que rompe Turbo/lint.
- Directorios legacy vacíos coexistiendo con estructura canónica en `apps/services/*`.

## 3. PROBLEMAS CRÍTICOS (BLOQUEANTES)

### Build
1. **Build raíz falla** (`pnpm -w run build`) por errores TS en gateway y módulos Nest faltantes (`@nestjs/passport`, `@nestjs/terminus`, `@nestjs/axios`) + tipado inseguro.
2. Motor Node inconsistente: root soporta `>=18`, auth-service exige `>=22`.
3. Resolución de paths dependiente de `dist` en servicios (riesgo de fallo en entorno limpio).

### Test
1. **Test raíz falla** (`pnpm -w run test`) porque el comando usa `pnpm -r ... run test` de forma que no encuentra script `run` en el conjunto de proyectos.
2. Cobertura de servicios skeleton es funcionalmente irrelevante (tests de strings), no valida arquitectura ni casos de dominio.

### Deploy
1. CI/CD oficial en `.github/workflows` está desactivado y movido a `workflows-disabled` (sin pipeline activo).
2. `docker-compose.prod.yml` referencia rutas legacy (`apps/auth-service/Dockerfile`, `apps/order-service/Dockerfile`, etc.) coexistiendo con ubicación canónica declarada en workspace (`apps/services/*`).
3. La estrategia declarada es despliegue manual; no existe puerta de calidad automatizada obligatoria para producción.

## 4. DEUDA TÉCNICA REAL (NO ESTÉTICA)
- **Deuda estructural de monorepo:** coexistencia de árboles legacy y canónicos + exclusiones en workspace para ocultar duplicados.
- **Deuda de catálogo de servicios:** presencia de múltiples “microservicios” sin contrato runtime real ni integración de infraestructura.
- **Deuda de contratos y dependencias compartidas:** duplicación de paquete con mismo nombre rompe resolución determinista de workspace.
- **Deuda de tipado/consistencia TS:** strict global declarado, pero roto en servicios críticos y con `skipLibCheck: true` a nivel base.
- **Deuda operativa:** ausencia de CI activa y dependencia en ejecución manual para build/test/deploy.

## 5. DECISIONES ARQUITECTÓNICAS

### Bien tomadas
- Existencia de separación explícita por capas en `order-service`.
- Uso de paquete compartido de eventos versionados y contexto de dominio por bounded context.

### Dudosas
- Mantener al mismo tiempo directorios legacy y canónicos, con exclusiones en workspace como mecanismo de contención.
- Configurar scripts root para ejecutar de forma recursiva en un workspace heterogéneo sin contrato mínimo de scripts por paquete.

### Incumplidas en el código
- DDD/Hexagonal no es patrón transversal del repo: convive con servicios de ejemplo que no implementan puertos/adaptadores ni dominio real.
- “Microservicios en producción” no está respaldado por pipeline CI/CD activo ni por build estable del conjunto.

## 6. RECOMENDACIONES (SOLO CORREGIR / ELIMINAR / CONGELAR)

### Corregir
1. Corregir bloqueantes de build en gateway (dependencias Nest faltantes y errores TS).
2. Corregir duplicidad de `@a4co/shared-events` para restablecer ejecución de Turbo.
3. Corregir scripts root de test/lint/build para que operen sobre un subconjunto explícito y válido de workspaces.
4. Corregir inconsistencia de versión de Node entre root y servicios.
5. Corregir `docker-compose.prod.yml` para que apunte sólo a rutas canónicas existentes y no vacías.

### Eliminar
1. Eliminar servicios plantilla/skeleton del scope productivo (o retirarlos del workspace productivo).
2. Eliminar duplicados legacy vacíos en `apps/*` cuando exista versión canónica en `apps/services/*`.
3. Eliminar paquetes duplicados con mismo `name` de npm.

### Congelar
1. Congelar nuevos desarrollos funcionales hasta cerrar bloqueantes de build/test/deploy.
2. Congelar despliegues de producción mientras no exista pipeline CI mínima reactivada y build verde del set crítico.

## Veredicto final
**No**: en su estado actual, este proyecto **no puede ponerse en producción de forma segura sin una reescritura parcial del perímetro operativo** (no necesariamente del dominio completo), porque falla en capacidades mínimas de build/test/CI y tiene deuda estructural activa.
