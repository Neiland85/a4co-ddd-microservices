# 📋 PLAN DE ACCIÓN - FASE 1

**Proyecto:** Portal Artesanos Jaén/Andalucía  
**Fecha de Creación:** $(date +%Y-%m-%d)  
**Duración Estimada:** 2-3 semanas  
**Estado:** 🟡 En Planificación

---

## 🎯 OBJETIVO PRINCIPAL

Consolidar el flujo de negocio principal **Order → Payment → Inventory** con:
- ✅ Comunicación asíncrona mediante NATS JetStream
- ✅ Persistencia independiente por microservicio
- ✅ Implementación de Saga Pattern para transacciones distribuidas
- ✅ Métricas y monitoreo operativo
- ✅ Tests E2E del flujo completo

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### Servicios Implementados

| Servicio | Estado | Completitud | Notas |
|----------|--------|-------------|-------|
| **order-service** | ✅ Implementado | 88% | Necesita integración NATS |
| **payment-service** | ✅ Implementado | 90% | Stripe configurado, falta webhook |
| **inventory-service** | ✅ Implementado | 80% | Prisma configurado, falta reservas |
| **auth-service** | ✅ Implementado | 95% | Funcional |
| **user-service** | ✅ Implementado | 90% | Funcional |
| **product-service** | ✅ Implementado | 85% | Funcional |
| **notification-service** | ✅ Implementado | 75% | Multi-channel configurado |
| **transportista-service** | ✅ Implementado | 70% | Python/FastAPI |

### Infraestructura

| Componente | Estado | Puerto | Notas |
|------------|--------|--------|-------|
| **PostgreSQL** | ✅ Operativo | 5432 | Healthy |
| **Redis** | ✅ Operativo | 6379 | Healthy |
| **NATS** | ✅ Operativo | 4222 | Necesita JetStream configurado |
| **Docker Compose** | ✅ Configurado | - | compose.dev.yaml |

---

## 🗺️ ARQUITECTURA FASE 1

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│              • Catálogo productos                        │
│              • Carrito de compra                         │
│              • Checkout                                  │
└────────────────────┬──────────────────────────────────────┘
                     │ HTTP REST
┌────────────────────┴──────────────────────────────────────┐
│              API GATEWAY (NestJS)                         │
│              • Routing                                    │
│              • Auth middleware                            │
└────────────────────┬──────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌───▼──────┐ ┌───▼──────────┐
│ ORDER        │ │ PAYMENT  │ │ INVENTORY    │
│ SERVICE      │ │ SERVICE  │ │ SERVICE      │
│ (Saga        │ │ (Stripe) │ │ (Stock       │
│ Orchestrator)│ │          │ │  Management)│
└───────┬──────┘ └───┬──────┘ └───┬──────────┘
        │            │            │
        └────────────┼────────────┘
                     │
            ┌────────▼────────┐
            │  NATS JetStream │
            │  (Event Bus)    │
            └─────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌───▼──────┐ ┌───▼──────────┐
│ PostgreSQL   │ │ PostgreSQL│ │ PostgreSQL   │
│ orders_db    │ │ payments_│ │ inventory_db │
│              │ │ db       │ │              │
└──────────────┘ └──────────┘ └──────────────┘
```

---

## 📝 TAREAS POR SERVICIO

### 1. ORDER-SERVICE (Coordinador Saga)

#### Tareas Pendientes

- [ ] **Configurar NATS JetStream** (2h)
  - [ ] Instalar `@nestjs/microservices` y `nats`
  - [ ] Configurar cliente NATS en `order-service`
  - [ ] Crear módulo de eventos de dominio
  - [ ] Configurar JetStream streams y subjects

- [ ] **Implementar Saga Orchestrator** (8h)
  - [ ] Crear `OrderSaga` class
  - [ ] Implementar flujo: CreateOrder → ReserveInventory → ProcessPayment
  - [ ] Implementar compensación: RollbackInventory → CancelPayment
  - [ ] Manejo de estados: STARTED → STOCK_RESERVED → PAYMENT_PENDING → COMPLETED
  - [ ] Manejo de errores y timeouts

- [ ] **Eventos de Dominio** (4h)
  - [ ] `OrderCreated` event
  - [ ] `OrderConfirmed` event
  - [ ] `OrderCancelled` event
  - [ ] `OrderFailed` event
  - [ ] Publicar eventos a NATS

- [ ] **Integración con Inventory** (3h)
  - [ ] Escuchar `InventoryReserved` event
  - [ ] Escuchar `InventoryOutOfStock` event
  - [ ] Manejar compensación si falla

- [ ] **Integración con Payment** (3h)
  - [ ] Escuchar `PaymentSucceeded` event
  - [ ] Escuchar `PaymentFailed` event
  - [ ] Actualizar estado de orden

- [ ] **Métricas Prometheus** (2h)
  - [ ] Exponer `/orders/metrics` endpoint
  - [ ] Métricas: `saga_success_rate`, `saga_duration`, `order_status_count`
  - [ ] Configurar scraping en Prometheus

- [ ] **Tests E2E** (4h)
  - [ ] Test: Flujo completo exitoso
  - [ ] Test: Fallo en inventory (compensación)
  - [ ] Test: Fallo en payment (compensación)
  - [ ] Test: Timeout en saga

**Total Order-Service: 26 horas**

---

### 2. PAYMENT-SERVICE

#### Tareas Pendientes

- [ ] **Configurar NATS JetStream** (2h)
  - [ ] Instalar dependencias NATS
  - [ ] Configurar cliente NATS
  - [ ] Suscribirse a eventos de Order

- [ ] **Eventos de Dominio** (3h)
  - [ ] `PaymentSucceeded` event
  - [ ] `PaymentFailed` event
  - [ ] `PaymentPending` event
  - [ ] Publicar eventos a NATS

- [ ] **Integración con Order** (4h)
  - [ ] Escuchar `OrderCreated` event
  - [ ] Crear Payment Intent automáticamente
  - [ ] Notificar resultado a Order Service

- [ ] **Webhook Stripe** (4h)
  - [ ] Endpoint `/payments/webhook`
  - [ ] Validar signature de Stripe
  - [ ] Procesar eventos: `payment_intent.succeeded`, `payment_intent.failed`
  - [ ] Publicar eventos de dominio

- [ ] **Manejo de Errores** (2h)
  - [ ] Retry logic para pagos fallidos
  - [ ] Logging estructurado
  - [ ] Alertas para pagos fallidos

- [ ] **Tests E2E** (3h)
  - [ ] Test: Pago exitoso
  - [ ] Test: Pago fallido
  - [ ] Test: Webhook de Stripe

**Total Payment-Service: 18 horas**

---

### 3. INVENTORY-SERVICE

#### Tareas Pendientes

- [ ] **Configurar NATS JetStream** (2h)
  - [ ] Instalar dependencias NATS
  - [ ] Configurar cliente NATS
  - [ ] Suscribirse a eventos de Order

- [ ] **Sistema de Reservas** (6h)
  - [ ] Crear `StockReservation` entity
  - [ ] Implementar `reserveStock()` use case
  - [ ] Implementar `releaseReservation()` use case
  - [ ] Validar stock disponible antes de reservar
  - [ ] Expiración automática de reservas (TTL)

- [ ] **Eventos de Dominio** (3h)
  - [ ] `InventoryReserved` event
  - [ ] `InventoryOutOfStock` event
  - [ ] `InventoryReleased` event
  - [ ] Publicar eventos a NATS

- [ ] **Integración con Order** (4h)
  - [ ] Escuchar `OrderCreated` event
  - [ ] Reservar stock automáticamente
  - [ ] Escuchar `OrderCancelled` event
  - [ ] Liberar reserva si se cancela

- [ ] **Alertas de Stock Bajo** (2h)
  - [ ] Configurar umbrales por producto
  - [ ] Publicar evento `LowStockAlert`
  - [ ] Integrar con notification-service

- [ ] **Tests E2E** (3h)
  - [ ] Test: Reserva exitosa
  - [ ] Test: Stock insuficiente
  - [ ] Test: Liberación de reserva

**Total Inventory-Service: 20 horas**

---

### 4. INFRAESTRUCTURA Y CONFIGURACIÓN

#### Tareas Pendientes

- [ ] **Configurar NATS JetStream** (4h)
  - [ ] Crear streams: `orders`, `payments`, `inventory`
  - [ ] Configurar subjects y consumers
  - [ ] Configurar retención y replicación
  - [ ] Documentar configuración

- [ ] **Schemas de Base de Datos** (3h)
  - [ ] Verificar schemas Prisma de cada servicio
  - [ ] Ejecutar migraciones
  - [ ] Crear índices necesarios
  - [ ] Validar relaciones

- [ ] **Docker Compose** (2h)
  - [ ] Actualizar `compose.dev.yaml` con NATS JetStream
  - [ ] Configurar variables de entorno
  - [ ] Health checks para todos los servicios
  - [ ] Documentar comandos de inicio

- [ ] **Variables de Entorno** (1h)
  - [ ] Crear `.env.example` consolidado
  - [ ] Documentar variables requeridas
  - [ ] Validar configuración en todos los servicios

**Total Infraestructura: 10 horas**

---

### 5. TESTING Y VALIDACIÓN

#### Tareas Pendientes

- [ ] **Tests E2E del Flujo Completo** (8h)
  - [ ] Test: Flujo completo exitoso (Order → Inventory → Payment)
  - [ ] Test: Fallo en inventory (compensación completa)
  - [ ] Test: Fallo en payment (compensación completa)
  - [ ] Test: Timeout en saga
  - [ ] Test: Reconexión NATS después de fallo

- [ ] **Tests de Integración** (4h)
  - [ ] Test: Order Service → NATS → Inventory Service
  - [ ] Test: Order Service → NATS → Payment Service
  - [ ] Test: Payment Service → Stripe Webhook

- [ ] **Tests de Carga** (3h)
  - [ ] Simular 100 órdenes concurrentes
  - [ ] Validar que no hay pérdida de eventos
  - [ ] Validar tiempos de respuesta

- [ ] **Validación de Métricas** (2h)
  - [ ] Verificar que Prometheus scrapea correctamente
  - [ ] Validar métricas expuestas
  - [ ] Crear dashboard básico en Grafana (opcional)

**Total Testing: 17 horas**

---

### 6. DOCUMENTACIÓN

#### Tareas Pendientes

- [ ] **Documentación Técnica** (4h)
  - [ ] Diagrama de secuencia del flujo Saga
  - [ ] Documentar eventos de dominio
  - [ ] Documentar configuración NATS
  - [ ] Guía de troubleshooting

- [ ] **API Documentation** (2h)
  - [ ] Actualizar Swagger/OpenAPI specs
  - [ ] Documentar endpoints nuevos
  - [ ] Ejemplos de uso

- [ ] **Runbook Operacional** (2h)
  - [ ] Procedimientos de deployment
  - [ ] Procedimientos de rollback
  - [ ] Monitoreo y alertas

**Total Documentación: 8 horas**

---

## 📅 TIMELINE DETALLADO

### Semana 1: Setup y Core Implementation

| Día | Tareas | Horas | Responsable |
|-----|--------|-------|-------------|
| **Lunes** | Configurar NATS JetStream (todos los servicios)<br>Schemas de BD y migraciones | 8h | DevOps/Backend |
| **Martes** | Order Service: Saga Orchestrator (inicio)<br>Order Service: Eventos de dominio | 8h | Backend Dev 1 |
| **Miércoles** | Order Service: Integración Inventory<br>Order Service: Integración Payment | 8h | Backend Dev 1 |
| **Jueves** | Payment Service: NATS + Eventos<br>Payment Service: Webhook Stripe | 8h | Backend Dev 2 |
| **Viernes** | Inventory Service: Sistema de Reservas<br>Inventory Service: Eventos | 8h | Backend Dev 2 |

**Total Semana 1: 40 horas**

---

### Semana 2: Integración y Testing

| Día | Tareas | Horas | Responsable |
|-----|--------|-------|-------------|
| **Lunes** | Integración completa Order ↔ Inventory ↔ Payment<br>Métricas Prometheus | 8h | Backend Dev 1 + 2 |
| **Martes** | Tests E2E: Flujo completo<br>Tests E2E: Compensaciones | 8h | QA/Backend |
| **Miércoles** | Tests de Integración<br>Tests de Carga | 8h | QA/Backend |
| **Jueves** | Documentación técnica<br>API Documentation | 8h | Tech Lead |
| **Viernes** | Validación final<br>Runbook operacional<br>Preparación para demo | 8h | Todo el equipo |

**Total Semana 2: 40 horas**

---

### Semana 3: Buffer y Refinamiento (Opcional)

| Día | Tareas | Horas | Responsable |
|-----|--------|-------|-------------|
| **Lunes-Martes** | Refinamiento basado en feedback<br>Optimizaciones de performance | 16h | Todo el equipo |
| **Miércoles** | Demo interna<br>Retrospectiva | 4h | Todo el equipo |

**Total Semana 3: 20 horas (buffer)**

---

## ✅ CRITERIOS DE ÉXITO

### Funcionales

- [ ] **Flujo Completo Funcional**
  - [ ] `POST /orders` crea orden y dispara saga completa
  - [ ] Stock se reserva automáticamente
  - [ ] Payment Intent se crea automáticamente
  - [ ] Webhook de Stripe actualiza estado de orden
  - [ ] Compensación funciona si falla inventory o payment

- [ ] **Trazabilidad**
  - [ ] Todos los eventos se publican a NATS
  - [ ] Logs estructurados en todos los servicios
  - [ ] Historial completo de estados de orden

- [ ] **Métricas**
  - [ ] Endpoint `/orders/metrics` expone métricas
  - [ ] Prometheus puede scrapear métricas
  - [ ] Dashboard básico en Grafana (opcional)

### Técnicos

- [ ] **Tests**
  - [ ] Tests E2E pasando (3 flujos clave)
  - [ ] Cobertura de código >70% en servicios críticos
  - [ ] Tests de integración pasando

- [ ] **Performance**
  - [ ] Tiempo de respuesta <500ms para crear orden
  - [ ] Saga completa se completa en <5 segundos
  - [ ] Sistema soporta 100 órdenes concurrentes

- [ ] **Confiabilidad**
  - [ ] Sistema se recupera después de fallo de NATS
  - [ ] No hay pérdida de eventos
  - [ ] Compensación funciona correctamente

---

## 🔍 CHECKLIST DE VALIDACIÓN

### Pre-Desarrollo

- [ ] NATS JetStream configurado y corriendo
- [ ] PostgreSQL corriendo para todos los servicios
- [ ] Variables de entorno configuradas
- [ ] Docker Compose actualizado

### Durante Desarrollo

- [ ] Cada servicio puede conectarse a NATS
- [ ] Eventos se publican correctamente
- [ ] Eventos se consumen correctamente
- [ ] Schemas de BD actualizados
- [ ] Migraciones ejecutadas

### Pre-Producción

- [ ] Todos los tests pasando
- [ ] Documentación actualizada
- [ ] Métricas funcionando
- [ ] Health checks funcionando
- [ ] Logs estructurados

---

## 🚨 RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **NATS JetStream no funciona correctamente** | Media | Alto | Configurar en desarrollo temprano, tests de integración |
| **Compensación de Saga falla** | Media | Alto | Tests exhaustivos, logging detallado |
| **Webhook de Stripe no funciona** | Baja | Medio | Tests con Stripe CLI, validación de signature |
| **Pérdida de eventos** | Baja | Alto | Configurar retención en NATS, idempotencia |
| **Performance degradado** | Media | Medio | Tests de carga, optimización de queries |

---

## 📊 MÉTRICAS DE SEGUIMIENTO

### Métricas Técnicas

- **Saga Success Rate**: >95%
- **Saga Duration**: <5 segundos (p95)
- **Error Rate**: <1%
- **Event Processing Time**: <100ms (p95)

### Métricas de Negocio

- **Order Completion Rate**: >98%
- **Payment Success Rate**: >95%
- **Inventory Accuracy**: 100%

---

## 🛠️ COMANDOS ÚTILES

### Desarrollo

```bash
# Iniciar infraestructura
docker compose -f compose.dev.yaml up -d

# Iniciar servicios
pnpm dev:order
pnpm dev:payment
pnpm dev:inventory

# Ver logs de NATS
docker logs a4co-nats -f

# Verificar conexión NATS
nats stream ls
nats consumer ls
```

### Testing

```bash
# Tests E2E
pnpm test:e2e

# Tests de integración
pnpm test:integration

# Tests de carga
pnpm test:load
```

### Monitoreo

```bash
# Ver métricas de Order Service
curl http://localhost:3004/orders/metrics

# Ver health checks
curl http://localhost:3004/health
curl http://localhost:3005/health
curl http://localhost:3006/health
```

---

## 📚 RECURSOS Y REFERENCIAS

### Documentación Interna

- [FASE1_CORE_DDD_SAGAS.md](docs/FASE1_CORE_DDD_SAGAS.md)
- [BACKEND_100_COMPLETE.md](BACKEND_100_COMPLETE.md)
- [ACCIONES_INMEDIATAS.md](ACCIONES_INMEDIATAS.md)

### Documentación Externa

- [NATS JetStream Documentation](https://docs.nats.io/nats-concepts/jetstream)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [Saga Pattern](https://microservices.io/patterns/data/saga.html)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **Revisar este plan** con el equipo (1h)
2. **Asignar responsables** para cada tarea
3. **Configurar NATS JetStream** en desarrollo (2h)
4. **Crear rama de feature**: `feature/phase1-saga-integration`
5. **Iniciar implementación** del Order Service Saga

---

## 📝 NOTAS ADICIONALES

- Este plan asume que los servicios base ya están implementados (según BACKEND_100_COMPLETE.md)
- El enfoque es en la integración y comunicación asíncrona
- Se prioriza la confiabilidad sobre la velocidad
- Se recomienda hacer commits frecuentes y pequeños

---

**Estado del Plan:** ✅ Listo para ejecución  
**Última Actualización:** $(date +%Y-%m-%d)  
**Versión:** 1.0
