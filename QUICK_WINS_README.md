# 🚀 QUICK WINS - Guía de Ejecución

Este documento explica cómo ejecutar los **Quick Wins** para desbloquear el proyecto y tenerlo funcionando en **menos de 1 hora**.

## 📋 Pre-requisitos

Verificar que tienes instalado:

```bash
node --version    # v24.10.0+
pnpm --version    # 10.14.0+
docker --version  # 28.5.1+
```

## 🎯 Opción 1: Ejecutar TODO Automáticamente (Recomendado)

### Ejecutar el master script

```bash
./scripts/quick-wins-all.sh
```

Este script ejecutará los 4 Quick Wins en orden:

1. ✅ Estandarizar versiones de NestJS
2. ✅ Completar OrderModule
3. ✅ Arrancar NATS + crear .env
4. ✅ Compilar servicios

**Tiempo estimado**: 10-15 minutos

---

## 🔧 Opción 2: Ejecutar Paso a Paso (Manual)

### Quick Win #1: Fix NestJS Versions

```bash
./scripts/standardize-nestjs.sh
```

**Qué hace**:

- Actualiza `@nestjs/common`, `@nestjs/core`, `@nestjs/microservices` a v11.x
- Sincroniza versiones en todos los microservicios
- Resuelve conflictos de dependencias

**Tiempo**: 5 minutos

---

### Quick Win #2: Completar OrderModule

**Ya está hecho!** Los siguientes archivos han sido creados/actualizados:

```
✅ apps/order-service/src/order.module.ts
   - Agregados: controllers, providers, imports (NATS, Config)

✅ apps/order-service/src/application/use-cases/create-order.use-case.ts
   - Nuevo: Use case para crear órdenes

✅ apps/order-service/src/infrastructure/metrics/order-metrics.service.ts
   - Nuevo: Métricas de Prometheus

✅ apps/order-service/src/presentation/controllers/controller.ts
   - Actualizado: Decoradores NestJS, endpoints REST

✅ apps/order-service/src/domain/aggregates/order.aggregate.ts
   - Agregados: métodos getDomainEvents(), confirmPayment(), cancel()
```

**Tiempo**: 0 minutos (ya completado)

---

### Quick Win #3: Arrancar NATS + Crear .env

```bash
./scripts/setup-local-env.sh
```

**Qué hace**:

- Crea archivos `.env` y `.env.local` con variables necesarias
- Arranca NATS JetStream en Docker
- Verifica PostgreSQL y Redis
- Genera Prisma clients

**Resultado**:

```
✅ NATS:       nats://localhost:4222
✅ NATS UI:    http://localhost:8222
✅ PostgreSQL: postgresql://dev:dev@localhost:5432/a4co_dev
✅ Redis:      redis://localhost:6379
```

**Tiempo**: 2-3 minutos

---

### Quick Win #4: Primer Test E2E

**Ya está hecho!** Test creado en:

```
tests/e2e/order-saga-flow.e2e.spec.ts
```

**Ejecutar el test**:

```bash
pnpm test:e2e tests/e2e/order-saga-flow.e2e.spec.ts
```

**Tiempo**: 1 minuto

---

## 🧪 Verificación de Instalación

### 1. Compilar Order Service

```bash
cd apps/order-service
pnpm build
```

**Esperado**: ✅ Sin errores de compilación

---

### 2. Arrancar Order Service

```bash
# Desde la raíz del proyecto
pnpm dev:order
```

**Esperado**:

```
[Nest] 12345 - 01/01/2024, 10:00:00 AM   LOG [NestFactory] Starting Nest application...
[Nest] 12345 - 01/01/2024, 10:00:00 AM   LOG [InstanceLoader] OrderModule dependencies initialized
[Nest] 12345 - 01/01/2024, 10:00:00 AM   LOG [RoutesResolver] OrderController {/orders}
[Nest] 12345 - 01/01/2024, 10:00:00 AM   LOG [NestApplication] Nest application successfully started
```

---

### 3. Probar Endpoints

#### Health Check

```bash
curl http://localhost:3004/orders
```

**Esperado**:

```json
{
  "status": "ok",
  "service": "order-service",
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

#### Crear Order

```bash
curl -X POST http://localhost:3004/orders \
  -H 'Content-Type: application/json' \
  -d '{
    "customerId": "customer-123",
    "items": [
      {
        "productId": "product-1",
        "quantity": 2,
        "unitPrice": 50.0
      }
    ]
  }'
```

**Esperado**:

```json
{
  "orderId": "order-1704096000000-abc123",
  "status": "PENDING",
  "message": "Order created successfully"
}
```

#### Ver Métricas

```bash
curl http://localhost:3004/orders/metrics
```

**Esperado**:

```
# HELP orders_created_total Total number of orders created
# TYPE orders_created_total counter
orders_created_total{customer_type="standard"} 1
...
```

---

### 4. Verificar NATS

#### Ver UI de NATS

```bash
open http://localhost:8222
```

#### Ver logs

```bash
docker logs nats
```

**Esperado**: Sin errores, puerto 4222 escuchando

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@nestjs/microservices'"

**Solución**:

```bash
pnpm install
pnpm --filter @a4co/order-service add @nestjs/microservices@^11.1.8
```

---

### Error: "Port 4222 already in use"

**Ver qué está usando el puerto**:

```bash
lsof -i :4222
```

**Solución**:

```bash
docker stop nats
docker rm nats
./scripts/setup-local-env.sh
```

---

### Error: "ECONNREFUSED postgresql://..."

**Verificar PostgreSQL**:

```bash
docker ps | grep postgres
```

**Si no está corriendo**:

```bash
docker compose -f .devcontainer/docker-compose.dev.yml up -d postgres
```

---

### Error de compilación TypeScript

**Limpiar y reinstalar**:

```bash
rm -rf node_modules apps/*/node_modules
pnpm install
pnpm build:all
```

---

### NATS no recibe eventos

**Verificar conexión**:

```bash
# Ver logs del servicio
pnpm dev:order

# En otra terminal, crear una orden
curl -X POST http://localhost:3004/orders -H 'Content-Type: application/json' -d '...'

# Ver logs de NATS
docker logs -f nats
```

---

## 📊 Estado del Proyecto Después de Quick Wins

### ✅ Lo que funciona

- [x] Order Service compila sin errores
- [x] Endpoints REST funcionando
- [x] NATS JetStream corriendo
- [x] Métricas de Prometheus expuestas
- [x] Health checks operativos
- [x] DDD patterns implementados
- [x] Dependency Injection configurado

### ⚠️ Lo que falta (ver prompts de agentes)

- [ ] Payment Service DDD completo
- [ ] Inventory Service con eventos
- [ ] Saga Order→Payment→Inventory E2E
- [ ] Event Bus centralizado
- [ ] Tests de integración con NATS
- [ ] Dockerfiles de producción
- [ ] CI/CD workflows activos

---

## 🚀 Next Steps

### Inmediato (próximas horas)

1. **Ejecutar Agente #2**: Completar Payment Service

   ```
   Ver: PROMPTS_AGENTES.md → Agente #2
   ```

2. **Ejecutar Agente #3**: Completar Inventory Service

   ```
   Ver: PROMPTS_AGENTES.md → Agente #3
   ```

3. **Test E2E completo**: Order → Payment → Inventory

   ```bash
   pnpm test:e2e tests/e2e/order-saga-flow.e2e.spec.ts
   ```

### Corto plazo (próximos días)

1. **Ejecutar Agente #4**: Dockerfiles de producción
2. **Ejecutar Agente #5**: CI/CD completo
3. **Ejecutar Agente #6**: Event Bus centralizado

### Mediano plazo (próximas semanas)

1. **Ejecutar Agente #7**: Kubernetes + Helm
2. **Ejecutar Agente #8**: Testing avanzado
3. **Ejecutar Agente #9**: Observability completa

---

## 📚 Recursos Adicionales

- **Documentación de auditoría**: Ver reporte de auditoría manual
- **Prompts de agentes**: Ver archivo con los 9 prompts
- **Arquitectura DDD**: `apps/auth-service/` (referencia completa)
- **Docs oficiales NestJS**: https://docs.nestjs.com

---

## 🎓 Conceptos Clave Implementados

### Domain-Driven Design (DDD)

- ✅ **Aggregates**: Order (con AggregateRoot)
- ✅ **Value Objects**: OrderId, OrderItem, Money
- ✅ **Domain Events**: OrderCreatedEvent, OrderStatusChangedEvent
- ✅ **Repositories**: IOrderRepository (interface) + InMemoryOrderRepository
- ✅ **Use Cases**: CreateOrderUseCase

### Event-Driven Architecture

- ✅ **Event Bus**: NATS JetStream
- ✅ **Event Publishing**: Desde aggregates
- ✅ **Event Subscription**: @EventPattern decorators (próximamente)

### Observability

- ✅ **Metrics**: Prometheus (orders_created_total, etc.)
- ✅ **Health Checks**: /orders endpoint
- ✅ **Structured Logging**: Pino (heredado de main.ts)

---

## ✅ Checklist de Verificación

Antes de continuar con los agentes, asegúrate de que:

- [ ] Todos los scripts se ejecutaron sin errores
- [ ] Order service compila correctamente
- [ ] El servicio arranca y escucha en puerto 3004
- [ ] Puedes crear órdenes vía API
- [ ] NATS está corriendo y accesible
- [ ] PostgreSQL y Redis están corriendo
- [ ] Las métricas de Prometheus están disponibles
- [ ] Los logs no muestran errores críticos

---

**¿Listo para el siguiente paso?**

Ejecuta:

```bash
./scripts/quick-wins-all.sh
```

Y luego continúa con los **Prompts de Agentes** para llevar el proyecto al máximo nivel! 🚀
