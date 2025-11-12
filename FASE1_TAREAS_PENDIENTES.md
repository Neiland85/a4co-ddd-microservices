# 📋 INFORME DE TAREAS PENDIENTES - FASE 1

**Fecha de Generación**: 2025-11-12  
**Objetivo FASE1**: Consolidar el flujo de negocio principal **Order → Payment → Inventory** con comunicación asíncrona mediante NATS JetStream, Saga Pattern para transacciones distribuidas, y monitoreo operativo.

---

## 📊 RESUMEN EJECUTIVO

### Estado General
- **Progreso Estimado**: ~40% completado
- **Servicios Principales**: 3 (Order, Payment, Inventory)
- **Infraestructura Base**: ✅ NATS JetStream habilitado, PostgreSQL configurado
- **Bloqueadores Críticos**: 
  - ❌ Saga Orchestrator incompleto (falta integración con Inventory)
  - ❌ Webhook Stripe no implementado
  - ❌ NATS client no configurado en Payment e Inventory
  - ❌ E2E tests inexistentes

### Componentes por Estado

| Componente | Estado | Prioridad |
|------------|--------|-----------|
| NATS JetStream (infraestructura) | ✅ Habilitado | - |
| Order Service - Saga Base | 🟡 Parcial (solo Payment) | 🔴 CRÍTICO |
| Payment Service - NATS Config | ❌ Faltante | 🔴 CRÍTICO |
| Payment Service - Webhook Stripe | ❌ Faltante | 🔴 CRÍTICO |
| Inventory Service - NATS Config | ❌ Faltante | 🔴 CRÍTICO |
| Inventory Service - Reservations | 🟡 Parcial | 🔴 CRÍTICO |
| E2E Tests | ❌ Inexistentes | 🔴 CRÍTICO |
| Métricas Prometheus | 🟡 Definidas, no expuestas | 🟠 ALTO |
| Documentación Saga | ❌ Faltante | 🟠 ALTO |

---

## 🎯 TAREAS PENDIENTES DETALLADAS

### 1️⃣ SETUP INICIAL Y CONFIGURACIÓN

#### 1.1 Rama y Entorno
- [ ] **Crear rama**: `feature/phase1-saga-integration`
- [ ] **Consolidar variables de entorno**:
  - Verificar `.env` en los 3 servicios
  - Crear `.env.example` completo con documentación
  - Incluir: `NATS_URL`, `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- [ ] **Ejecutar migraciones Prisma** en los 3 servicios:
  ```bash
  cd apps/order-service && npx prisma migrate deploy
  cd apps/payment-service && npx prisma migrate deploy
  cd apps/inventory-service && npx prisma migrate deploy
  ```

#### 1.2 Configuración NATS JetStream
- [ ] **Crear configuración de Streams en NATS**:
  - Stream `orders` con subjects: `order.created.v1`, `order.confirmed.v1`, `order.cancelled.v1`
  - Stream `payments` con subjects: `payment.succeeded.v1`, `payment.failed.v1`, `payment.pending.v1`
  - Stream `inventory` con subjects: `inventory.reserved.v1`, `inventory.out_of_stock.v1`, `inventory.released.v1`
- [ ] **Configurar consumers** para cada servicio con retry policies
- [ ] **Documentar configuración** en `docs/nats-jetstream-config.md`

---

### 2️⃣ ORDER-SERVICE (Coordinador Saga)

**Archivo Principal**: `apps/order-service/src/application/sagas/order.saga.ts`

#### 2.1 Saga Orchestrator - Flujo Principal
**Estado Actual**: Parcial - Solo maneja eventos de Payment, falta integración con Inventory.

- [ ] **Implementar flujo completo**:
  ```
  CreateOrder → ReserveInventory → ProcessPayment → OrderCompleted
  ```
  
- [ ] **Agregar escucha de eventos de Inventory**:
  ```typescript
  // En OrderSaga.execute()
  this.eventBus.subscribe("InventoryReserved", async (e: InventoryReservedEvent) => {
    // Actualizar orden a "STOCK_RESERVED"
    // Disparar ProcessPayment
  });
  
  this.eventBus.subscribe("InventoryOutOfStock", async (e: InventoryOutOfStockEvent) => {
    // Actualizar orden a "CANCELLED"
    // Publicar OrderCancelledEvent
  });
  ```

#### 2.2 Compensación (Rollback)
- [ ] **Implementar lógica de compensación**:
  - Si Payment falla → Liberar reserva de Inventory
  - Si Inventory falla → Cancelar orden (ya existe parcialmente)
  
- [ ] **Crear método `compensate()`**:
  ```typescript
  async compensate(orderId: string, reason: string) {
    // Publicar InventoryReleaseEvent
    // Publicar OrderCancelledEvent
    // Registrar métricas de compensación
  }
  ```

#### 2.3 Manejo de Estados
- [ ] **Implementar máquina de estados completa**:
  - `PENDING` → `STOCK_RESERVED` → `PAYMENT_PROCESSING` → `COMPLETED`
  - `PENDING` → `CANCELLED` (si falla Inventory)
  - `STOCK_RESERVED` → `CANCELLED` (si falla Payment)

#### 2.4 Timeouts y Errores
- [ ] **Agregar timeouts** para cada paso de la saga (e.g., 30s para Inventory, 60s para Payment)
- [ ] **Implementar retry logic** con backoff exponencial
- [ ] **Logging estructurado** con correlation IDs

#### 2.5 Métricas y Observabilidad
**Estado Actual**: Métricas definidas en `order-metrics.service.ts`, pero endpoint no expuesto.

- [ ] **Exponer endpoint `/orders/metrics`** en `order.controller.ts`:
  ```typescript
  @Get('metrics')
  async getMetrics() {
    return this.metricsService.getMetrics();
  }
  ```

- [ ] **Verificar que se registren todas las métricas**:
  - `order_saga_started_total`
  - `order_saga_completed_total`
  - `order_saga_failed_total`
  - `order_saga_compensated_total`
  - `order_saga_duration_seconds`

#### 2.6 Tests
- [ ] **Unit tests** para `OrderSaga`:
  - Test: Flujo exitoso completo
  - Test: Compensación por fallo en Inventory
  - Test: Compensación por fallo en Payment
  - Test: Timeout en Inventory
  - Test: Timeout en Payment

---

### 3️⃣ PAYMENT-SERVICE

**Archivos Principales**: 
- `apps/payment-service/src/payment.module.ts`
- `apps/payment-service/src/presentation/payment.controller.ts`

#### 3.1 Configuración NATS
**Estado Actual**: ❌ Cliente NATS no configurado explícitamente.

- [ ] **Agregar configuración NATS en `payment.module.ts`**:
  ```typescript
  import { ClientsModule, Transport } from '@nestjs/microservices';
  
  @Module({
    imports: [
      ClientsModule.register([
        {
          name: 'NATS_SERVICE',
          transport: Transport.NATS,
          options: {
            servers: [process.env.NATS_URL || 'nats://localhost:4222'],
            queue: 'payment-service-queue',
          },
        },
      ]),
      // ... otros imports
    ],
    // ...
  })
  ```

#### 3.2 Webhook Stripe
**Estado Actual**: ❌ Endpoint `/payments/webhook` no existe.

- [ ] **Crear endpoint POST `/payments/webhook`**:
  ```typescript
  @Post('webhook')
  async handleStripeWebhook(
    @Body() body: any,
    @Headers('stripe-signature') signature: string,
  ) {
    // 1. Validar signature de Stripe
    // 2. Procesar evento según tipo
    // 3. Publicar evento de dominio correspondiente
  }
  ```

- [ ] **Implementar validación de signature**:
  ```typescript
  const event = this.stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  ```

- [ ] **Procesar eventos de Stripe**:
  - `payment_intent.succeeded` → Publicar `PaymentSucceededEvent`
  - `payment_intent.payment_failed` → Publicar `PaymentFailedEvent`
  - `payment_intent.processing` → Publicar `PaymentPendingEvent`

#### 3.3 Publicación de Eventos
- [ ] **Crear eventos de dominio faltantes**:
  - `PaymentPendingEvent` (si no existe)
  
- [ ] **Asegurar publicación desde Use Cases**:
  - Después de crear Payment Intent → Publicar evento
  - Desde webhook → Publicar eventos según resultado

#### 3.4 Manejo de Errores
- [ ] **Implementar retry logic** para llamadas a Stripe API
- [ ] **Logging estructurado** con IDs de transacción
- [ ] **Alertas** para pagos fallidos consecutivos

#### 3.5 Tests
- [ ] **Unit tests**:
  - Test: Creación exitosa de Payment Intent
  - Test: Manejo de error de Stripe
  - Test: Publicación de evento después de pago exitoso
  
- [ ] **Integration tests**:
  - Test: Webhook de Stripe con signature válida
  - Test: Webhook de Stripe con signature inválida
  - Test: Procesamiento de `payment_intent.succeeded`

---

### 4️⃣ INVENTORY-SERVICE

**Archivos Principales**: 
- `apps/inventory-service/src/inventory.module.ts`
- `apps/inventory-service/src/application/handlers/reserve-stock.handler.ts`

#### 4.1 Configuración NATS
**Estado Actual**: ❌ Cliente NATS no configurado explícitamente.

- [ ] **Agregar configuración NATS en `inventory.module.ts`**:
  ```typescript
  import { ClientsModule, Transport } from '@nestjs/microservices';
  
  @Module({
    imports: [
      ClientsModule.register([
        {
          name: 'NATS_SERVICE',
          transport: Transport.NATS,
          options: {
            servers: [process.env.NATS_URL || 'nats://localhost:4222'],
            queue: 'inventory-service-queue',
          },
        },
      ]),
      // ... otros imports
    ],
    // ...
  })
  ```

#### 4.2 Event Handlers
**Estado Actual**: `ReserveStockHandler` existe, pero falta handlers para eventos externos.

- [ ] **Crear handler para `OrderCreated`**:
  ```typescript
  @EventPattern('order.created.v1')
  async handleOrderCreated(@Payload() data: OrderCreatedEvent) {
    await this.reserveStockHandler.handle(data.orderId, data.items);
  }
  ```

- [ ] **Crear handler para `OrderCancelled`**:
  ```typescript
  @EventPattern('order.cancelled.v1')
  async handleOrderCancelled(@Payload() data: OrderCancelledEvent) {
    await this.releaseReservationUseCase.execute(data.orderId);
  }
  ```

#### 4.3 Sistema de Reservas
**Estado Actual**: Modelo `StockReservation` existe, pero lógica de negocio incompleta.

- [ ] **Implementar `ReserveStockUseCase` completo**:
  - Validar stock disponible antes de reservar
  - Crear registro en `StockReservation` con `status: RESERVED`
  - Decrementar stock disponible
  - Establecer `expiresAt` (e.g., +15 minutos)
  
- [ ] **Implementar `ReleaseReservationUseCase`**:
  - Buscar reserva por `orderId`
  - Actualizar `status` a `RELEASED`
  - Incrementar stock disponible
  
- [ ] **Implementar expiración automática de reservas** (TTL):
  - Crear job/cron que busque reservas expiradas
  - Liberar stock automáticamente
  - Publicar evento `InventoryReleasedEvent`

#### 4.4 Alertas de Stock Bajo
- [ ] **Crear configuración de umbrales** por producto (e.g., en base de datos o config)
- [ ] **Implementar lógica de `LowStockAlert`**:
  - Después de cada reserva, verificar stock disponible
  - Si está por debajo del umbral → Publicar `LowStockAlertEvent`
  
- [ ] **Integrar con `notification-service`** (si existe) para enviar alertas

#### 4.5 Tests
- [ ] **Unit tests**:
  - Test: Reserva exitosa con stock suficiente
  - Test: Reserva fallida por stock insuficiente
  - Test: Liberación de reserva
  - Test: Expiración automática de reserva
  
- [ ] **Integration tests**:
  - Test: Handler de `OrderCreated` → Publica `InventoryReserved`
  - Test: Handler de `OrderCancelled` → Libera reserva

---

### 5️⃣ TESTING Y VALIDACIÓN

**Estado Actual**: ❌ No se encontraron tests E2E (búsqueda de `*e2e*.spec.ts` retornó 0 archivos).

#### 5.1 E2E Tests - Flujos Principales
- [ ] **Test: Flujo completo exitoso**
  ```
  POST /orders → InventoryReserved → PaymentSucceeded → Order COMPLETED
  ```
  - Verificar estado final de Order
  - Verificar Payment en Stripe
  - Verificar StockReservation en DB

- [ ] **Test: Fallo en Inventory (stock insuficiente)**
  ```
  POST /orders → InventoryOutOfStock → Order CANCELLED
  ```
  - Verificar que no se creó Payment Intent
  - Verificar que orden está en estado CANCELLED

- [ ] **Test: Fallo en Payment**
  ```
  POST /orders → InventoryReserved → PaymentFailed → ReleaseInventory → Order CANCELLED
  ```
  - Verificar compensación: stock liberado
  - Verificar orden en estado CANCELLED

#### 5.2 E2E Tests - Escenarios de Error
- [ ] **Test: Timeout en Inventory**
  - Simular delay en `inventory-service`
  - Verificar timeout de saga
  - Verificar compensación

- [ ] **Test: Timeout en Payment**
  - Simular delay en `payment-service`
  - Verificar timeout de saga
  - Verificar compensación

- [ ] **Test: Reconexión NATS**
  - Detener NATS durante saga
  - Reiniciar NATS
  - Verificar que eventos se procesan después de reconexión

#### 5.3 Tests de Integración
- [ ] **Order Service ↔ Inventory Service**:
  - Publicar `OrderCreated` → Verificar que Inventory recibe y responde

- [ ] **Order Service ↔ Payment Service**:
  - Publicar `OrderCreated` → Verificar que Payment recibe y responde

- [ ] **Payment Service ↔ Stripe**:
  - Test de webhook con evento real de Stripe (en test mode)

#### 5.4 Tests de Carga
- [ ] **Simular 100 órdenes concurrentes**:
  - Verificar que no se pierden eventos
  - Verificar tiempos de respuesta < 2s (p95)
  - Verificar que no hay race conditions en reservas de stock

---

### 6️⃣ MÉTRICAS Y MONITOREO

#### 6.1 Configuración Prometheus
- [ ] **Verificar scraping** de métricas en los 3 servicios
- [ ] **Configurar `prometheus.yml`** con targets:
  ```yaml
  scrape_configs:
    - job_name: 'order-service'
      static_configs:
        - targets: ['order-service:3000']
    - job_name: 'payment-service'
      static_configs:
        - targets: ['payment-service:3001']
    - job_name: 'inventory-service'
      static_configs:
        - targets: ['inventory-service:3002']
  ```

#### 6.2 Dashboard Grafana (Opcional pero Recomendado)
- [ ] **Crear dashboard básico** con:
  - Tasa de órdenes creadas (órdenes/segundo)
  - Tasa de éxito de sagas (%)
  - Tasa de compensación de sagas (%)
  - Latencia p50, p95, p99 de sagas
  - Stock disponible por producto (top 10)

#### 6.3 Health Checks
- [ ] **Implementar `/health` en todos los servicios**:
  - Verificar conexión a DB
  - Verificar conexión a NATS
  - Verificar conexión a Stripe (solo Payment)

---

### 7️⃣ DOCUMENTACIÓN

#### 7.1 Documentación Técnica
- [ ] **Diagrama de secuencia del flujo Saga** (Mermaid o PlantUML):
  ```
  Order → Inventory → Payment → Order (success)
  Order → Inventory → Payment (fail) → Inventory (rollback) → Order (cancel)
  ```

- [ ] **Documentación de Eventos de Dominio** (`docs/domain-events.md`):
  - Nombre del evento
  - Payload (schema JSON)
  - Producer
  - Consumers
  - Ejemplo

- [ ] **Configuración NATS JetStream** (`docs/nats-jetstream-config.md`):
  - Streams
  - Subjects
  - Consumers
  - Retry policies

#### 7.2 Guías Operacionales
- [ ] **Guía de Troubleshooting** (`docs/saga-troubleshooting.md`):
  - Orden atascada en estado PENDING
  - Pago no procesado
  - Stock no liberado después de cancelación
  - NATS desconectado

- [ ] **Runbook Operacional** (`docs/fase1-runbook.md`):
  - Deployment checklist
  - Rollback procedure
  - Monitoreo y alertas
  - Logs y debugging

#### 7.3 API Documentation
- [ ] **Actualizar Swagger/OpenAPI specs** para:
  - `POST /orders` (Order Service)
  - `POST /payments/webhook` (Payment Service)
  - `GET /orders/metrics` (Order Service)

---

## ✅ CRITERIOS DE ÉXITO FASE 1

### Funcionales
- [ ] ✅ `POST /orders` dispara saga completa automáticamente
- [ ] ✅ Orden se completa cuando Payment es exitoso y Stock reservado
- [ ] ✅ Orden se cancela automáticamente si falla Inventory o Payment
- [ ] ✅ Stock se libera automáticamente en compensaciones
- [ ] ✅ Webhook de Stripe procesa eventos correctamente

### No Funcionales
- [ ] ✅ 100% de sagas exitosas llegan a estado final (COMPLETED o CANCELLED)
- [ ] ✅ 0% de pérdida de eventos en NATS
- [ ] ✅ Latencia p95 de saga < 2 segundos
- [ ] ✅ Todos los tests E2E pasan
- [ ] ✅ Cobertura de tests > 80% en lógica de saga

### Observabilidad
- [ ] ✅ Métricas expuestas en Prometheus
- [ ] ✅ Logs estructurados con correlation IDs
- [ ] ✅ Health checks funcionando
- [ ] ✅ Dashboard de monitoreo operativo

---

## 📅 ESTIMACIÓN DE ESFUERZO

| Categoría | Tareas | Horas Estimadas | Prioridad |
|-----------|--------|-----------------|-----------|
| **Setup & Config** | 8 | 4h | 🔴 CRÍTICO |
| **Order Service** | 15 | 12h | 🔴 CRÍTICO |
| **Payment Service** | 12 | 10h | 🔴 CRÍTICO |
| **Inventory Service** | 13 | 10h | 🔴 CRÍTICO |
| **Testing E2E** | 10 | 16h | 🔴 CRÍTICO |
| **Métricas & Monitoring** | 6 | 6h | 🟠 ALTO |
| **Documentación** | 8 | 8h | 🟠 ALTO |
| **TOTAL** | **72 tareas** | **~66 horas** | - |

### Distribución Sugerida
- **Sprint 1 (Semana 1)**: Setup + Order Service + NATS Config (20h)
- **Sprint 2 (Semana 2)**: Payment Service + Inventory Service (20h)
- **Sprint 3 (Semana 3)**: Testing E2E + Métricas (22h)
- **Sprint 4 (Semana 4)**: Documentación + Bug fixes (8h)

---

## 🚨 BLOQUEADORES IDENTIFICADOS

### Críticos (Bloquean progreso)
1. **NATS Client no configurado en Payment e Inventory**: Sin esto, no pueden consumir/publicar eventos
2. **Saga Orchestrator incompleto**: No integra con Inventory, no puede completar flujo
3. **Webhook Stripe faltante**: Payment Service no puede recibir confirmaciones de Stripe

### Importantes (Reducen calidad)
1. **Tests E2E inexistentes**: No hay validación del flujo completo
2. **Métricas no expuestas**: Dificulta monitoreo en producción
3. **Documentación faltante**: Dificulta onboarding y troubleshooting

---

## 📌 RECOMENDACIONES

### Orden de Implementación Sugerido
1. **Configurar NATS clients** en Payment e Inventory (BLOQUEADOR)
2. **Implementar webhook Stripe** (BLOQUEADOR)
3. **Completar Saga Orchestrator** con integración Inventory (BLOQUEADOR)
4. **Implementar handlers** de eventos en Inventory
5. **Crear tests E2E** del flujo happy path
6. **Implementar compensaciones** completas
7. **Crear tests E2E** de escenarios de error
8. **Exponer métricas** y configurar Prometheus
9. **Documentar** todo lo implementado

### Buenas Prácticas a Seguir
- **Usar correlation IDs** en todos los logs y eventos
- **Implementar idempotencia** en handlers de eventos
- **Usar transacciones de DB** donde sea necesario
- **Validar schemas de eventos** con bibliotecas como `class-validator`
- **Testear manualmente con Stripe CLI** antes de tests automatizados

---

## 📞 PRÓXIMOS PASOS INMEDIATOS

1. **Reunión de Planning**: Revisar este informe con el equipo
2. **Crear tickets en Jira/GitHub**: Una tarea por item crítico
3. **Asignar responsables**: Order (Dev A), Payment (Dev B), Inventory (Dev C)
4. **Configurar entorno de desarrollo**: Todos los devs deben poder levantar los 3 servicios
5. **Definir Definition of Done**: Acordar criterios antes de empezar

---

**Autor**: Background Agent (Cursor AI)  
**Revisión Requerida**: Tech Lead, Product Owner  
**Última Actualización**: 2025-11-12
