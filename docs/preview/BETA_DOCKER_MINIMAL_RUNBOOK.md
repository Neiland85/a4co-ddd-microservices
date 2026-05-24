# A4CO Beta Docker Minimal Runbook — Draft

## Objetivo

Levantar una beta mínima reproducible del preview canónico de A4CO con:

- Postgres
- NATS
- API Gateway
- Order Service
- Inventory Service

## No incluye todavía

- Frontend
- Dashboard
- Auth Service
- Product Service
- Payment Service
- Observabilidad completa
- Datos reales de negocio
- Hardening final de imagen Docker

## Baseline previa validada

- main alineado con origin/main
- test:preview OK
- check:fast OK
- build:preview OK
- audit prod local: 8 vulnerabilities, 1 high, 7 moderate
- imagen Docker beta construida de forma determinista tras limpiar dist/tsbuildinfo

## Comandos previstos

docker build -f Dockerfile.beta -t a4co-ddd-microservices-beta-app:local .

docker compose -f docker-compose.beta.yml up -d

docker compose -f docker-compose.beta.yml ps

curl -i http://localhost:8088/api/v1/health
curl -i http://localhost:8088/api/v1/health/ready
curl -i http://localhost:8088/api/v1/health/live
curl -i http://localhost:3004/health
curl -i http://localhost:3004/orders
curl -i http://localhost:3006/api/inventory/health
curl -i http://localhost:18222/healthz

## Riesgos conocidos

- docker-compose.preview.yml legacy está desalineado con el preview canónico.
- El runtime mezcla paquetes con type=module y build CommonJS; la beta Docker usa package.json de dist con type=commonjs para resolverlo.
- La imagen beta actual es grande y no optimizada.
- NATS en beta usa JetStream con almacenamiento temporal.
- Queda pendiente dockerización final multi-stage optimizada.

## Estado validado en esta iteración

Resultado: beta Docker mínima validada.

Validado correctamente:

- Imagen Docker beta local construida.
- Postgres healthy.
- NATS healthy.
- API Gateway llegó a estado healthy.
- API Gateway respondió 200 en:
  - /api/v1/health
  - /api/v1/health/ready
  - /api/v1/health/live
- Inventory Service arrancó, conectó con NATS y confirmó conexión a base de datos.

Pendiente:

- Validar una ejecución completa con el último Dockerfile.beta.
- Order Service fallaba en la imagen anterior por incompatibilidad CommonJS/ESM en packages/domain/order/dist.
- Dockerfile.beta ya incluye package scopes CommonJS para packages/domain/order/dist y packages/domain/inventory/dist, pero queda pendiente una validación runtime completa.
- Inventory Service quedó unhealthy pese a arrancar; requiere revisar healthcheck/puerto/respuesta HTTP.
- Optimización de imagen Docker multi-stage.
- Persistencia/ajuste de almacenamiento JetStream para NATS.
- Integración de servicios no incluidos: frontend, dashboard, auth, product, payment.

## Decisión

Se considera beta Docker mínima validada para gateway + order + inventory + nats + postgres.

No se considera todavía beta completa de producto porque quedan fuera frontend, dashboard, auth, product y payment.

Esta baseline deja documentado:

- docker-compose.preview.yml legacy no es el camino actual para beta mínima.
- docker-compose.beta.yml define una beta canónica reducida.
- Dockerfile.beta fuerza build determinista limpiando dist/tsbuildinfo.
- El siguiente paso es validar runtime completo con el Dockerfile.beta actual.


## Estado validado posterior

En la validación posterior de healthchecks se confirmó:

- API Gateway healthy.
- Order Service healthy.
- Inventory Service healthy.
- NATS healthy.
- Postgres healthy.

Smoke HTTP validado:

- `GET http://localhost:8088/api/v1/health` -> 200
- `GET http://localhost:8088/api/v1/health/ready` -> 200
- `GET http://localhost:8088/api/v1/health/live` -> 200
- `GET http://localhost:3004/orders` -> 200
- `GET http://localhost:3006/api/inventory/health` -> 200
- `GET http://localhost:18222/healthz` -> 200

Ajustes aplicados:

- Healthcheck de order-service alineado a `/orders`.
- Inventory Service alineado a puerto interno `3006`.
- Gateway apunta a `inventory-service:3006`.
