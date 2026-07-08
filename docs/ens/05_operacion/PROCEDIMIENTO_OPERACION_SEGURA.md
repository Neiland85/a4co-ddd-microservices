# Procedimiento de operación segura ENS-ready

Este procedimiento define una operación mínima segura para el runtime beta.

No implica certificación ENS.

## 1. Objetivo

Garantizar que el entorno puede:

- arrancar de forma controlada;
- verificar servicios críticos;
- generar evidencias;
- parar sin dejar contenedores huérfanos;
- diferenciar validación incremental de validación completa.

## 2. Alcance

Incluye:

- API Gateway.
- Order Service.
- Inventory Service.
- PostgreSQL.
- NATS / JetStream.
- Docker Compose beta.
- Evidencias en `docs/ens/04_evidencias`.

Excluye por ahora:

- Auth Service.
- Product Service.
- Payment Service.
- Certificación ENS.
- Auditoría externa.

## 3. Arranque seguro incremental

```bash
docker compose -f docker-compose.beta.yml up -d postgres nats
sleep 30
docker ps --filter "name=a4co-beta"
docker compose -f docker-compose.beta.yml up -d --no-build api-gateway order-service inventory-service
sleep 20
docker ps --filter "name=a4co-beta"
4. Validación de salud
curl -i http://localhost:8088/api/v1/health
curl -i http://localhost:8088/api/v1/health/live
curl -i http://localhost:8088/api/v1/health/ready
curl -i http://localhost:3004/orders
curl -i http://localhost:3006/api/inventory/health
curl -i http://localhost:18222/healthz
5. Puertos válidos beta
Servicio	Puerto host	Puerto contenedor
API Gateway	8088	3000
Order Service	3004	3000
Inventory Service	3006	3006
PostgreSQL	55433	5432
NATS	14222	4222
NATS Monitor	18222	8222
6. Puertos descartados en esta validación
8080: pertenece a otro servicio externo al compose beta.
3001: no publicado en runtime beta incremental.
3002: no publicado en runtime beta incremental.
7. Parada segura
docker compose -f docker-compose.beta.yml down --remove-orphans --timeout 5

Si hay bloqueo:

docker ps -a --filter "name=a4co-"
docker compose -f docker-compose.beta.yml down --remove-orphans --timeout 1
docker compose -f docker-compose.preview.yml down --remove-orphans --timeout 1
8. Evidencias mínimas por ejecución

Cada ejecución relevante debe guardar:

docker ps;
logs de NATS;
logs de PostgreSQL;
logs de Gateway;
logs de Order Service;
logs de Inventory Service;
responses HTTP de healthchecks;
estado final documentado.
9. Criterio de éxito

La validación incremental es correcta si:

PostgreSQL está healthy.
NATS está healthy.
API Gateway está healthy.
Order Service está healthy.
Inventory Service está healthy.
Healthchecks responden 200 OK.
Las evidencias quedan guardadas en docs/ens/04_evidencias.
10. Criterio de fallo

Se considera fallo si:

cualquier contenedor crítico queda unhealthy;
NATS no responde en /healthz;
Gateway no responde en /api/v1/health;
Inventory no conecta con base de datos;
quedan contenedores huérfanos activos;
no se genera evidencia.
