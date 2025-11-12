# 📋 INFORME DE TAREAS FALTANTES - FASE 1

**Fecha de Generación:** 2025-01-27  
**Proyecto:** Portal Artesanos Jaén/Andalucía  
**Fase:** FASE 1 - Core DDD + Sagas  
**Estado General:** 🟡 En Desarrollo (Aproximadamente 40% completado)

---

## 📊 RESUMEN EJECUTIVO

### Estado de Completitud por Área

| Área | Completitud | Estado | Prioridad |
|------|-------------|--------|-----------|
| **Infraestructura NATS JetStream** | 30% | 🔴 Crítico | ALTA |
| **Order Service - Saga Orchestrator** | 35% | 🟡 En Progreso | ALTA |
| **Payment Service - Integración** | 50% | 🟡 En Progreso | ALTA |
| **Inventory Service - Reservas** | 60% | 🟡 En Progreso | ALTA |
| **Tests E2E** | 20% | 🔴 Crítico | ALTA |
| **Métricas y Monitoreo** | 70% | 🟢 Parcial | MEDIA |
| **Documentación** | 40% | 🟡 En Progreso | MEDIA |

### Estimación Total de Tareas Pendientes

- **Total de Horas Estimadas:** ~99 horas
- **Tareas Críticas:** 18
- **Tareas Importantes:** 12
- **Tareas Opcionales:** 8

---

## 🚨 TAREAS CRÍTICAS (Prioridad ALTA)

### 1. INFRAESTRUCTURA NATS JETSTREAM

#### 1.1 Configuración de Streams y Subjects
**Estado:** ❌ No Implementado  
**Estimación:** 4 horas  
**Prioridad:** 🔴 CRÍTICA

**Tareas:**
- [ ] Crear script de inicialización de streams NATS JetStream
- [ ] Configurar stream `orders` con subjects:
  - `order.created.v1`
  - `order.confirmed.v1`
  - `order.cancelled.v1`
  - `order.failed.v1`
- [ ] Configurar stream `payments` con subjects:
  - `payment.succeeded.v1`
  - `payment.failed.v1`
  - `payment.pending.v1`
- [ ] Configurar stream `inventory` con subjects:
  - `inventory.reserved.v1`
  - `inventory.out-of-stock.v1`
  - `inventory.released.v1`
  - `inventory.low-stock.v1`
- [ ] Configurar retención de mensajes (7 días recomendado)
- [ ] Configurar replicación para alta disponibilidad
- [ ] Documentar configuración de streams

**Archivos a Crear/Modificar:**
- `infra/nats/jetstream-setup.ts` (nuevo)
- `infra/nats/streams-config.yaml` (nuevo)
- `compose.dev.yaml` (actualizar comando NATS)

**Evidencia Actual:**
- NATS está corriendo con `-js` flag en `compose.dev.yaml`
- No hay configuración de streams explícita
- No hay scripts de inicialización

---

### 2. ORDER SERVICE - SAGA ORCHESTRATOR

#### 2.1 Implementación Completa de OrderSaga
**Estado:** 🟡 Parcialmente Implementado  
**Estimación:** 8 horas  
**Prioridad:** 🔴 CRÍTICA

**Tareas Pendientes:**
- [ ] **Refactorizar OrderSaga actual** (implementación básica existe en `apps/order-service/src/application/sagas/order.saga.ts`)
  - [ ] Implementar máquina de estados completa:
    - `STARTED` → `STOCK_RESERVED` → `PAYMENT_PENDING` → `COMPLETED`
    - Estados de error: `STOCK_FAILED`, `PAYMENT_FAILED`, `CANCELLED`
  - [ ] Implementar compensación completa:
    - `RollbackInventory()` cuando falla payment
    - `CancelPayment()` cuando falla inventory
  - [ ] Manejo de timeouts (configurar TTL de saga)
  - [ ] Persistencia de estado de saga en base de datos
  - [ ] Recuperación de sagas interrumpidas

- [ ] **Integración con Inventory Service**
  - [ ] Escuchar evento `InventoryReserved` correctamente
  - [ ] Escuchar evento `InventoryOutOfStock`
  - [ ] Implementar compensación cuando inventory falla
  - [ ] Manejar timeout de reserva de inventario

- [ ] **Integración con Payment Service**
  - [ ] Escuchar evento `PaymentSucceeded` correctamente
  - [ ] Escuchar evento `PaymentFailed`
  - [ ] Implementar compensación cuando payment falla
  - [ ] Manejar timeout de payment

- [ ] **Eventos de Dominio**
  - [ ] Verificar que `OrderCreated` se publica correctamente
  - [ ] Implementar `OrderConfirmed` event
  - [ ] Implementar `OrderCancelled` event
  - [ ] Implementar `OrderFailed` event
  - [ ] Asegurar que todos los eventos incluyen `sagaId`

**Archivos a Modificar:**
- `apps/order-service/src/application/sagas/order.saga.ts` (refactorizar)
- `apps/order-service/src/domain/events/` (completar eventos)
- `apps/order-service/src/infrastructure/repositories/order.repository.ts` (agregar métodos de saga)

**Evidencia Actual:**
- OrderSaga existe pero es muy básico
- Solo tiene suscripciones simples, no maneja estados ni compensación completa
- No hay persistencia de estado de saga

---

#### 2.2 Suscripción a Eventos NATS
**Estado:** 🟡 Parcialmente Implementado  
**Estimación:** 3 horas  
**Prioridad:** 🔴 CRÍTICA

**Tareas:**
- [ ] Implementar suscripciones usando `@EventPattern` de NestJS
- [ ] Configurar consumers de JetStream con:
  - Durable consumer names
  - Acknowledgment mode
  - Max delivery attempts
- [ ] Suscribirse a eventos de Inventory:
  - `inventory.reserved.v1`
  - `inventory.out-of-stock.v1`
- [ ] Suscribirse a eventos de Payment:
  - `payment.succeeded.v1`
  - `payment.failed.v1`
- [ ] Implementar idempotencia en handlers de eventos
- [ ] Manejar reconexión automática a NATS

**Archivos a Crear/Modificar:**
- `apps/order-service/src/application/handlers/inventory-events.handler.ts` (nuevo)
- `apps/order-service/src/application/handlers/payment-events.handler.ts` (nuevo)
- `apps/order-service/src/order.module.ts` (actualizar)

**Evidencia Actual:**
- Hay suscripciones básicas en OrderSaga pero no usan `@EventPattern`
- Payment service tiene `order-events.handler.ts` como referencia

---

### 3. PAYMENT SERVICE - WEBHOOK STRIPE

#### 3.1 Endpoint de Webhook Completo
**Estado:** 🟡 Parcialmente Implementado  
**Estimación:** 4 horas  
**Prioridad:** 🔴 CRÍTICA

**Tareas:**
- [ ] Crear endpoint `POST /payments/webhook` o `POST /webhooks/stripe`
- [ ] Implementar validación de signature de Stripe
  - Usar `constructWebhookEvent` que ya existe en `stripe.gateway.ts`
- [ ] Procesar eventos de Stripe:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `payment_intent.canceled`
- [ ] Publicar eventos de dominio a NATS:
  - `PaymentSucceeded` event
  - `PaymentFailed` event
- [ ] Manejar idempotencia (evitar procesar el mismo evento dos veces)
- [ ] Logging estructurado de webhooks
- [ ] Tests del webhook con Stripe CLI

**Archivos a Crear/Modificar:**
- `apps/payment-service/src/presentation/controllers/webhook.controller.ts` (nuevo)
- `apps/payment-service/src/application/handlers/stripe-webhook.handler.ts` (nuevo)
- `apps/payment-service/src/payment.module.ts` (actualizar)

**Evidencia Actual:**
- `stripe.gateway.ts` tiene método `constructWebhookEvent`
- OpenAPI spec menciona `/webhooks/stripe` pero no hay implementación
- No hay controlador de webhook

---

#### 3.2 Integración con Order Service
**Estado:** 🟡 Parcialmente Implementado  
**Estimación:** 3 horas  
**Prioridad:** 🔴 CRÍTICA

**Tareas:**
- [ ] Verificar que `OrderCreated` event se escucha correctamente
- [ ] Crear Payment Intent automáticamente cuando se recibe `OrderCreated`
- [ ] Incluir `sagaId` en Payment Intent metadata
- [ ] Publicar eventos con `sagaId` para correlación
- [ ] Manejar errores en creación de Payment Intent
- [ ] Retry logic para pagos fallidos

**Archivos a Modificar:**
- `apps/payment-service/src/application/handlers/order-events.handler.ts` (completar)
- `apps/payment-service/src/application/use-cases/process-payment.use-case.ts` (verificar)

**Evidencia Actual:**
- `order-events.handler.ts` existe y tiene `@EventPattern` configurado
- Necesita verificación de funcionamiento completo

---

### 4. INVENTORY SERVICE - SISTEMA DE RESERVAS

#### 4.1 Expiración Automática de Reservas (TTL)
**Estado:** ❌ No Implementado  
**Estimación:** 4 horas  
**Prioridad:** 🔴 CRÍTICA

**Tareas:**
- [ ] Implementar job/cron que expire reservas automáticamente
- [ ] Verificar reservas expiradas periódicamente (cada 5 minutos)
- [ ] Liberar stock cuando reserva expira
- [ ] Publicar evento `InventoryReleased` cuando expira
- [ ] Actualizar estado de reserva a `expired`
- [ ] Notificar a Order Service cuando reserva expira
- [ ] Configurar TTL por defecto (ej: 15 minutos)

**Archivos a Crear/Modificar:**
- `apps/inventory-service/src/application/services/reservation-cleanup.service.ts` (nuevo)
- `apps/inventory-service/src/inventory.module.ts` (agregar cron job)
- `apps/inventory-service/src/application/use-cases/release-stock.use-case.ts` (verificar)

**Evidencia Actual:**
- Schema tiene campo `expiresAt` en `StockReservation`
- No hay proceso automático que expire reservas
- `release-stock.use-case.ts` existe pero no se usa automáticamente

---

#### 4.2 Integración con Order Service
**Estado:** 🟡 Parcialmente Implementado  
**Estimación:** 3 horas  
**Prioridad:** 🔴 CRÍTICA

**Tareas:**
- [ ] Verificar que `OrderCreated` event se escucha correctamente
- [ ] Reservar stock automáticamente cuando se recibe `OrderCreated`
- [ ] Escuchar `OrderCancelled` event
- [ ] Liberar reserva cuando se cancela orden
- [ ] Publicar eventos con información completa:
  - `InventoryReserved` con orderId, items, expiration
  - `InventoryOutOfStock` con orderId y productos sin stock
  - `InventoryReleased` con orderId

**Archivos a Crear/Modificar:**
- `apps/inventory-service/src/application/handlers/order-events.handler.ts` (nuevo o verificar)
- `apps/inventory-service/src/inventory.module.ts` (configurar suscripciones)

**Evidencia Actual:**
- `ReserveStockHandler` existe pero no está conectado a eventos NATS
- No hay handler que escuche `OrderCreated`

---

#### 4.3 Alertas de Stock Bajo
**Estado:** ❌ No Implementado  
**Estimación:** 2 horas  
**Prioridad:** 🟡 MEDIA

**Tareas:**
- [ ] Implementar verificación de stock bajo después de reserva
- [ ] Publicar evento `LowStockAlert` cuando stock < `minimumStock`
- [ ] Integrar con notification-service (opcional para FASE1)
- [ ] Configurar umbrales por producto

**Archivos a Crear/Modificar:**
- `apps/inventory-service/src/domain/events/low-stock-alert.event.ts` (nuevo)
- `apps/inventory-service/src/application/services/stock-alert.service.ts` (nuevo)

---

### 5. TESTS E2E

#### 5.1 Tests del Flujo Completo
**Estado:** 🟡 Parcialmente Implementado  
**Estimación:** 8 horas  
**Prioridad:** 🔴 CRÍTICA

**Tareas:**
- [ ] **Test: Flujo completo exitoso**
  - Crear orden → Reservar inventory → Procesar payment → Confirmar orden
  - Verificar que todos los eventos se publican
  - Verificar que orden termina en estado `CONFIRMED`
  
- [ ] **Test: Fallo en inventory (compensación)**
  - Crear orden con productos sin stock
  - Verificar que inventory publica `InventoryOutOfStock`
  - Verificar que orden se cancela
  - Verificar que no se crea Payment Intent
  
- [ ] **Test: Fallo en payment (compensación)**
  - Crear orden con stock disponible
  - Simular fallo en payment
  - Verificar que inventory se libera (compensación)
  - Verificar que orden se cancela
  
- [ ] **Test: Timeout en saga**
  - Crear orden
  - Simular timeout en inventory o payment
  - Verificar que compensación se ejecuta
  - Verificar que orden se marca como fallida
  
- [ ] **Test: Reconexión NATS después de fallo**
  - Crear orden
  - Detener NATS
  - Verificar que servicios se recuperan
  - Verificar que eventos se procesan cuando NATS vuelve

**Archivos a Modificar:**
- `tests/e2e/order-saga-flow.e2e.spec.ts` (completar)
- `tests/core-saga.e2e.spec.ts` (implementar tests reales)

**Evidencia Actual:**
- `order-saga-flow.e2e.spec.ts` tiene tests básicos pero no cubren saga completa
- `core-saga.e2e.spec.ts` solo tiene placeholders

---

#### 5.2 Tests de Integración
**Estado:** ❌ No Implementado  
**Estimación:** 4 horas  
**Prioridad:** 🟡 MEDIA

**Tareas:**
- [ ] Test: Order Service → NATS → Inventory Service
- [ ] Test: Order Service → NATS → Payment Service
- [ ] Test: Payment Service → Stripe Webhook
- [ ] Verificar que eventos se publican y consumen correctamente

---

#### 5.3 Tests de Carga
**Estado:** ❌ No Implementado  
**Estimación:** 3 horas  
**Prioridad:** 🟡 MEDIA

**Tareas:**
- [ ] Simular 100 órdenes concurrentes
- [ ] Validar que no hay pérdida de eventos
- [ ] Validar tiempos de respuesta
- [ ] Validar que todas las sagas se completan

---

## 🟡 TAREAS IMPORTANTES (Prioridad MEDIA)

### 6. MÉTRICAS Y MONITOREO

#### 6.1 Métricas Prometheus
**Estado:** 🟢 Parcialmente Implementado  
**Estimación:** 2 horas  
**Prioridad:** 🟡 MEDIA

**Tareas:**
- [ ] Verificar que endpoint `/orders/metrics` funciona correctamente
- [ ] Agregar métricas faltantes:
  - `saga_success_rate` (ya existe en `order-metrics.service.ts`)
  - `saga_duration` (ya existe)
  - `order_status_count` (verificar)
- [ ] Configurar scraping en Prometheus (si aplica)
- [ ] Agregar métricas en Payment Service:
  - `payment_success_rate`
  - `payment_failed_rate`
  - `webhook_processed_total`
- [ ] Agregar métricas en Inventory Service:
  - `inventory_reserved_total`
  - `inventory_released_total`
  - `stock_low_alerts_total`

**Evidencia Actual:**
- `order-metrics.service.ts` tiene métricas de saga implementadas
- Endpoint `/orders/metrics` existe y funciona
- Falta agregar métricas en otros servicios

---

#### 6.2 Health Checks
**Estado:** 🟢 Implementado  
**Estimación:** 1 hora  
**Prioridad:** 🟢 BAJA

**Tareas:**
- [ ] Verificar que health checks funcionan en todos los servicios
- [ ] Agregar verificación de conexión NATS en health check
- [ ] Agregar verificación de conexión a BD en health check

---

### 7. DOCUMENTACIÓN

#### 7.1 Documentación Técnica
**Estado:** 🟡 Parcialmente Implementado  
**Estimación:** 4 horas  
**Prioridad:** 🟡 MEDIA

**Tareas:**
- [ ] Crear diagrama de secuencia del flujo Saga completo
- [ ] Documentar todos los eventos de dominio:
  - Orden, payload, versionado
  - Ejemplos de eventos
- [ ] Documentar configuración NATS JetStream:
  - Cómo configurar streams
  - Cómo crear consumers
  - Troubleshooting común
- [ ] Crear guía de troubleshooting:
  - Qué hacer si saga se queda colgada
  - Cómo recuperar eventos perdidos
  - Cómo debuggear problemas de NATS

**Archivos a Crear:**
- `docs/FASE1_SAGA_FLOW_DIAGRAM.md` (nuevo)
- `docs/FASE1_DOMAIN_EVENTS.md` (nuevo)
- `docs/FASE1_NATS_CONFIGURATION.md` (nuevo)
- `docs/FASE1_TROUBLESHOOTING.md` (nuevo)

---

#### 7.2 API Documentation
**Estado:** 🟡 Parcialmente Implementado  
**Estimación:** 2 horas  
**Prioridad:** 🟡 MEDIA

**Tareas:**
- [ ] Actualizar Swagger/OpenAPI specs con endpoints nuevos
- [ ] Documentar endpoint de webhook de Stripe
- [ ] Agregar ejemplos de uso de API
- [ ] Documentar códigos de error y sus significados

---

#### 7.3 Runbook Operacional
**Estado:** ❌ No Implementado  
**Estimación:** 2 horas  
**Prioridad:** 🟡 MEDIA

**Tareas:**
- [ ] Documentar procedimientos de deployment
- [ ] Documentar procedimientos de rollback
- [ ] Documentar monitoreo y alertas
- [ ] Documentar cómo escalar servicios

---

## 🟢 TAREAS OPCIONALES (Prioridad BAJA)

### 8. OPTIMIZACIONES Y MEJORAS

#### 8.1 Performance
**Estado:** ❌ No Implementado  
**Estimación:** 3 horas  
**Prioridad:** 🟢 BAJA

**Tareas:**
- [ ] Optimizar queries de base de datos
- [ ] Implementar caching donde sea apropiado
- [ ] Optimizar serialización de eventos

---

#### 8.2 Observabilidad
**Estado:** ❌ No Implementado  
**Estimación:** 2 horas  
**Prioridad:** 🟢 BAJA

**Tareas:**
- [ ] Agregar distributed tracing (OpenTelemetry)
- [ ] Mejorar logging estructurado
- [ ] Crear dashboard básico en Grafana (opcional)

---

## 📋 CHECKLIST DE VALIDACIÓN

### Pre-Desarrollo
- [x] NATS corriendo (con `-js` flag)
- [x] PostgreSQL corriendo para todos los servicios
- [ ] NATS JetStream streams configurados
- [ ] Variables de entorno configuradas
- [ ] Docker Compose actualizado

### Durante Desarrollo
- [ ] Cada servicio puede conectarse a NATS
- [ ] Eventos se publican correctamente a JetStream
- [ ] Eventos se consumen correctamente desde JetStream
- [ ] Schemas de BD actualizados
- [ ] Migraciones ejecutadas

### Pre-Producción
- [ ] Todos los tests E2E pasando
- [ ] Documentación actualizada
- [ ] Métricas funcionando
- [ ] Health checks funcionando
- [ ] Logs estructurados

---

## 🎯 CRITERIOS DE ÉXITO

### Funcionales
- [ ] `POST /orders` crea orden y dispara saga completa
- [ ] Stock se reserva automáticamente
- [ ] Payment Intent se crea automáticamente
- [ ] Webhook de Stripe actualiza estado de orden
- [ ] Compensación funciona si falla inventory o payment

### Técnicos
- [ ] Tests E2E pasando (3 flujos clave)
- [ ] Cobertura de código >70% en servicios críticos
- [ ] Tiempo de respuesta <500ms para crear orden
- [ ] Saga completa se completa en <5 segundos
- [ ] Sistema soporta 100 órdenes concurrentes

### Operacionales
- [ ] Logs estructurados en todos los servicios
- [ ] Métricas funcionando
- [ ] Health checks funcionando
- [ ] Documentación actualizada

---

## 📊 MÉTRICAS DE SEGUIMIENTO

### Métricas Técnicas Objetivo
- **Saga Success Rate**: >95%
- **Saga Duration**: <5 segundos (p95)
- **Error Rate**: <1%
- **Event Processing Time**: <100ms (p95)

### Métricas de Negocio Objetivo
- **Order Completion Rate**: >98%
- **Payment Success Rate**: >95%
- **Inventory Accuracy**: 100%

---

## 🚨 RIESGOS IDENTIFICADOS

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **NATS JetStream no configurado correctamente** | Alta | Alto | Configurar streams temprano, tests de integración |
| **Compensación de Saga falla** | Media | Alto | Tests exhaustivos, logging detallado |
| **Webhook de Stripe no funciona** | Baja | Medio | Tests con Stripe CLI, validación de signature |
| **Pérdida de eventos** | Media | Alto | Configurar retención en NATS, idempotencia |
| **Performance degradado** | Media | Medio | Tests de carga, optimización de queries |

---

## 📅 PLAN DE ACCIÓN RECOMENDADO

### Semana 1: Infraestructura y Core
1. **Día 1-2:** Configurar NATS JetStream streams (4h)
2. **Día 2-3:** Completar OrderSaga implementation (8h)
3. **Día 3-4:** Implementar webhook de Stripe (4h)
4. **Día 4-5:** TTL automático de reservas (4h)

### Semana 2: Integración y Testing
1. **Día 1-2:** Integración completa entre servicios (6h)
2. **Día 2-4:** Tests E2E completos (8h)
3. **Día 4-5:** Tests de integración y carga (7h)

### Semana 3: Documentación y Refinamiento
1. **Día 1-2:** Documentación técnica (4h)
2. **Día 2-3:** API Documentation y Runbook (4h)
3. **Día 3-5:** Refinamiento y validación final (8h)

---

## 📝 NOTAS ADICIONALES

- Este informe se basa en el análisis del código actual y la documentación existente
- Las estimaciones son aproximadas y pueden variar según la complejidad real
- Se recomienda priorizar las tareas críticas antes de avanzar a tareas opcionales
- El estado actual muestra que hay una base sólida pero falta completar la integración y los tests

---

**Última Actualización:** 2025-01-27  
**Versión del Informe:** 1.0  
**Generado por:** Análisis automatizado del código y documentación
