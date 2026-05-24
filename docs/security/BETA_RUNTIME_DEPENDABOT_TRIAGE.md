# Beta Runtime Dependabot Triage

## Contexto

Fecha: 2026-05-24

La beta Docker mínima validada está compuesta por:

- API Gateway
- Order Service
- Inventory Service
- NATS
- Postgres

Servicios explícitamente fuera de esta beta mínima:

- frontend
- dashboard
- auth-service
- product-service
- payment-service
- notification-service
- legal-evidence-service

## Estado validado

La beta Docker mínima fue validada con todos los servicios en estado healthy:

- API Gateway healthy
- Order Service healthy
- Inventory Service healthy
- NATS healthy
- Postgres healthy

Smoke HTTP validado:

- `GET http://localhost:8088/api/v1/health` -> 200
- `GET http://localhost:8088/api/v1/health/ready` -> 200
- `GET http://localhost:8088/api/v1/health/live` -> 200
- `GET http://localhost:3004/orders` -> 200
- `GET http://localhost:3006/api/inventory/health` -> 200
- `GET http://localhost:18222/healthz` -> 200

## Resultado de pnpm audit --prod

Resultado observado:

- 8 vulnerabilidades
- 1 high
- 7 moderate

## Clasificación

### Fuera de beta mínima actual

#### effect — high

Ruta observada:

- `apps__infrastructure__notification-service > @prisma/client > prisma > @prisma/config > effect`

Clasificación:

- Fuera de beta mínima actual.
- No bloquea gateway/order/inventory.
- Requiere tratamiento cuando notification-service entre en scope.

#### postcss — moderate

Rutas observadas:

- `apps__dashboard-client > next > postcss`
- `apps__dashboard-client > tailwind-variants > tailwindcss > postcss`

Clasificación:

- Frontend/dashboard fuera de beta mínima actual.
- No bloquea runtime backend mínimo.
- Tratar en fase frontend/dashboard.

#### uuid — moderate

Rutas observadas:

- `apps__infrastructure__notification-service > firebase-admin > @google-cloud/storage > uuid`
- `apps__services__legal-evidence-service > uuid`

Clasificación:

- Fuera de beta mínima actual.
- No bloquea gateway/order/inventory.
- Tratar cuando esos servicios entren en scope.

### Relevante para beta, pero no bloqueante inmediato

#### file-type — moderate

Ruta observada:

- `packages__observability > @nestjs/common > file-type`

Clasificación:

- `packages/observability` se compila dentro de la beta mínima.
- No se ha identificado explotación directa en los endpoints smoke validados.
- Requiere revisión controlada, preferentemente actualizando dependencias Nest/observability si no rompe build.

#### @nestjs/core — moderate

Ruta observada:

- `packages__observability > @nestjs/core`

Clasificación:

- `packages/observability` se compila dentro de la beta mínima.
- Riesgo relevante, no bloqueante del smoke.
- Candidato a siguiente fix quirúrgico.

## Prioridad recomendada

1. Mantener beta mínima validada sin cambios funcionales innecesarios.
2. Crear fixes pequeños solo sobre dependencias realmente en scope.
3. Priorizar `packages/observability`:
   - revisar actualización de `@nestjs/common`
   - revisar actualización de `@nestjs/core`
   - comprobar impacto sobre `file-type`
4. No perseguir todavía alertas de:
   - dashboard/frontend
   - notification-service
   - legal-evidence-service
   - servicios fuera de docker-compose.beta.yml
5. Después de cada cambio:
   - `pnpm run test:preview`
   - `pnpm run check:fast`
   - `pnpm run build:preview`
   - `docker compose -f docker-compose.beta.yml up -d --force-recreate`
   - smoke HTTP beta

## Decisión

Las alertas de Dependabot de GitHub siguen siendo deuda real, pero no invalidan la beta Docker mínima validada.

La estrategia correcta es triage por runtime real, no resolver el agregado completo de GitHub de forma indiscriminada.
