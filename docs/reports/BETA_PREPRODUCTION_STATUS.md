# A4CO — Estado beta / preproducción

## Resumen ejecutivo

El repositorio `a4co-ddd-microservices` dispone ya de una beta Docker mínima validada para el núcleo backend:

- API Gateway
- Order Service
- Inventory Service
- NATS
- Postgres

La beta mínima no representa todavía el producto completo, pero sí acredita que el núcleo gateway/order/inventory puede levantarse de forma reproducible en Docker, quedar en estado healthy y responder a endpoints smoke básicos.

## Última baseline validada

Commits relevantes:

- `f4987f65` — `fix(security): update observability nest runtime dependencies`
- `4c0f7e3b` — `docs(security): triage beta runtime dependabot alerts`
- `803f5c39` — `chore(beta): validate minimal docker runtime healthchecks`
- `0ce5c531` — `chore(beta): add partial docker beta baseline`
- `1854c313` — `test(preview): enable stable smoke test suite`

## Validaciones superadas

### Tests y build

Validado:

- `pnpm run test:preview`
- `pnpm run check:fast`
- `pnpm run build:preview`

La suite `test:preview` ejecuta smoke tests reales sobre:

- API Gateway
- Order Service
- Inventory Service

### Docker beta mínima

Validado con:

- `docker-compose.beta.yml`
- `Dockerfile.beta`

Servicios healthy:

- API Gateway
- Order Service
- Inventory Service
- NATS
- Postgres

Smoke HTTP validado:

- `GET http://localhost:8088/api/v1/health` -> 200
- `GET http://localhost:8088/api/v1/health/ready` -> 200
- `GET http://localhost:8088/api/v1/health/live` -> 200
- `GET http://localhost:3004/orders` -> 200
- `GET http://localhost:3006/api/inventory/health` -> 200
- `GET http://localhost:18222/healthz` -> 200

## Comandos operativos

Levantar beta mínima:

    pnpm run beta:up

Ver estado:

    pnpm run beta:ps

Ejecutar smoke:

    pnpm run beta:smoke

Ver logs:

    pnpm run beta:logs

Bajar beta:

    pnpm run beta:down

## Seguridad

Se realizó triage de Dependabot por impacto real en la beta runtime.

Resultado del audit productivo tras el último ajuste relevante:

- 5 vulnerabilidades productivas detectadas
- 1 high
- 4 moderate

Lectura actual:

- El `high` restante afecta a `notification-service`, fuera de la beta mínima actual.
- Los `moderate` restantes afectan principalmente a dashboard/frontend, notification-service o legal-evidence-service, fuera del núcleo Docker beta validado.
- Se corrigió el foco relevante de `packages/observability`, actualizando Nest runtime dependencies y reduciendo el audit productivo de 8 a 5 vulnerabilidades.

Documento de referencia:

- `docs/security/BETA_RUNTIME_DEPENDABOT_TRIAGE.md`

## Qué NO está incluido todavía

La beta mínima actual no incluye:

- Frontend
- Dashboard
- Auth Service
- Product Service
- Payment Service
- Notification Service
- Legal Evidence Service
- Observabilidad completa
- Hardening final de imagen Docker
- Optimización multi-stage de Docker
- Configuración real de secretos
- Datos reales de negocio

## Riesgos conocidos

1. Imagen Docker grande.

   `Dockerfile.beta` es funcional pero no está optimizado como imagen final multi-stage.

2. Servicios fuera de beta.

   Las alertas de seguridad en servicios no incluidos siguen siendo deuda real, aunque no bloquean la beta mínima actual.

3. Gateway contiene rutas hacia servicios no levantados.

   El gateway tiene rutas/proxies para auth, product, payment y sagas, pero la beta mínima solo valida order e inventory.

4. NATS JetStream temporal.

   La configuración actual de NATS en beta usa almacenamiento temporal. Para preproducción real debe revisarse persistencia.

5. Secretos de preview.

   Las credenciales de `docker-compose.beta.yml` son de preview/local. No deben reutilizarse como secretos reales de producción.

## Decisión de estado

Estado actual:

**Beta Docker mínima validada para núcleo backend gateway/order/inventory.**

No es todavía beta comercial completa, pero sí es una base defendible para:

- pruebas de runtime
- smoke tests
- revisión de observabilidad mínima
- preparación de preproducción
- due diligence técnica inicial

## Siguiente hoja de ruta recomendada

### Fase 1 — Operativa beta inmediata

- Mantener `beta:up`, `beta:smoke`, `beta:down` como flujo oficial.
- Añadir prueba automatizada de smoke en CI si procede.
- Versionar evidencias de smoke cuando se generen releases internas.

### Fase 2 — Docker hardening

- Convertir `Dockerfile.beta` a multi-stage.
- Reducir tamaño de imagen.
- Evitar dependencias dev/runtime innecesarias.
- Definir `.dockerignore` más estricto si procede.

### Fase 3 — Seguridad runtime

- Resolver o aislar alertas de Dependabot fuera de beta.
- Tratar `notification-service` cuando entre en scope.
- Tratar dashboard/frontend cuando entren en scope.
- Mantener auditoría separada entre runtime beta, dev tooling y servicios legacy/no incluidos.

### Fase 4 — Producto ampliado

Decidir si la beta comercial inicial necesita incluir:

- Auth Service
- Product Service
- Payment Service
- Frontend/Dashboard

o si la primera beta se vende/presenta como núcleo backend validado.
