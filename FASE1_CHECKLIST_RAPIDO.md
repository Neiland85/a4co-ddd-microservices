# ✅ CHECKLIST RÁPIDO - FASE 1

**Uso:** Marca las tareas conforme las completes

---

## 🚀 SETUP INICIAL (Día 1)

### Infraestructura
- [ ] NATS JetStream configurado y corriendo
- [ ] PostgreSQL corriendo para order-service
- [ ] PostgreSQL corriendo para payment-service
- [ ] PostgreSQL corriendo para inventory-service
- [ ] Docker Compose actualizado con NATS
- [ ] Variables de entorno configuradas

### Desarrollo
- [ ] Rama creada: `feature/phase1-saga-integration`
- [ ] Dependencias NATS instaladas en los 3 servicios
- [ ] Schemas Prisma verificados y migrados

---

## 📦 ORDER-SERVICE (26h)

### NATS y Eventos
- [ ] Cliente NATS configurado
- [ ] Eventos de dominio creados (OrderCreated, OrderConfirmed, etc.)
- [ ] Publicación de eventos funcionando

### Saga Orchestrator
- [ ] Clase `OrderSaga` creada
- [ ] Flujo principal: CreateOrder → ReserveInventory → ProcessPayment
- [ ] Compensación: RollbackInventory → CancelPayment
- [ ] Manejo de estados implementado
- [ ] Manejo de errores y timeouts

### Integraciones
- [ ] Escucha eventos de Inventory
- [ ] Escucha eventos de Payment
- [ ] Actualiza estado según eventos recibidos

### Métricas y Tests
- [ ] Endpoint `/orders/metrics` expuesto
- [ ] Tests E2E del flujo completo
- [ ] Tests de compensación

---

## 💳 PAYMENT-SERVICE (18h)

### NATS y Eventos
- [ ] Cliente NATS configurado
- [ ] Eventos de dominio creados (PaymentSucceeded, PaymentFailed, etc.)
- [ ] Publicación de eventos funcionando

### Integración
- [ ] Escucha `OrderCreated` event
- [ ] Crea Payment Intent automáticamente
- [ ] Notifica resultado a Order Service

### Webhook Stripe
- [ ] Endpoint `/payments/webhook` creado
- [ ] Validación de signature implementada
- [ ] Procesa eventos de Stripe correctamente
- [ ] Publica eventos de dominio

### Tests
- [ ] Test: Pago exitoso
- [ ] Test: Pago fallido
- [ ] Test: Webhook de Stripe

---

## 📦 INVENTORY-SERVICE (20h)

### NATS y Eventos
- [ ] Cliente NATS configurado
- [ ] Eventos de dominio creados (InventoryReserved, InventoryOutOfStock, etc.)
- [ ] Publicación de eventos funcionando

### Sistema de Reservas
- [ ] Entity `StockReservation` creada
- [ ] Use case `reserveStock()` implementado
- [ ] Use case `releaseReservation()` implementado
- [ ] Validación de stock disponible
- [ ] Expiración automática de reservas (TTL)

### Integración
- [ ] Escucha `OrderCreated` event
- [ ] Reserva stock automáticamente
- [ ] Escucha `OrderCancelled` event
- [ ] Libera reserva si se cancela

### Alertas
- [ ] Configuración de umbrales por producto
- [ ] Publicación de evento `LowStockAlert`

### Tests
- [ ] Test: Reserva exitosa
- [ ] Test: Stock insuficiente
- [ ] Test: Liberación de reserva

---

## 🧪 TESTING (17h)

### Tests E2E
- [ ] Flujo completo exitoso (Order → Inventory → Payment)
- [ ] Fallo en inventory (compensación completa)
- [ ] Fallo en payment (compensación completa)
- [ ] Timeout en saga
- [ ] Reconexión NATS después de fallo

### Tests de Integración
- [ ] Order Service → NATS → Inventory Service
- [ ] Order Service → NATS → Payment Service
- [ ] Payment Service → Stripe Webhook

### Tests de Carga
- [ ] 100 órdenes concurrentes
- [ ] Sin pérdida de eventos
- [ ] Tiempos de respuesta validados

---

## 📊 MÉTRICAS Y MONITOREO

- [ ] Prometheus scrapea métricas correctamente
- [ ] Métricas expuestas: `saga_success_rate`, `saga_duration`, `order_status_count`
- [ ] Dashboard básico en Grafana (opcional)
- [ ] Health checks funcionando en todos los servicios

---

## 📚 DOCUMENTACIÓN (8h)

- [ ] Diagrama de secuencia del flujo Saga
- [ ] Documentación de eventos de dominio
- [ ] Documentación de configuración NATS
- [ ] Guía de troubleshooting
- [ ] Swagger/OpenAPI specs actualizados
- [ ] Runbook operacional

---

## ✅ VALIDACIÓN FINAL

### Funcional
- [ ] `POST /orders` crea orden y dispara saga completa
- [ ] Stock se reserva automáticamente
- [ ] Payment Intent se crea automáticamente
- [ ] Webhook de Stripe actualiza estado de orden
- [ ] Compensación funciona si falla inventory o payment

### Técnico
- [ ] Todos los tests pasando
- [ ] Cobertura de código >70% en servicios críticos
- [ ] Tiempo de respuesta <500ms para crear orden
- [ ] Saga completa se completa en <5 segundos
- [ ] Sistema soporta 100 órdenes concurrentes

### Operacional
- [ ] Logs estructurados en todos los servicios
- [ ] Métricas funcionando
- [ ] Health checks funcionando
- [ ] Documentación actualizada

---

## 🎯 CRITERIOS DE ÉXITO

- [ ] **Saga Success Rate**: >95%
- [ ] **Saga Duration**: <5 segundos (p95)
- [ ] **Error Rate**: <1%
- [ ] **Order Completion Rate**: >98%
- [ ] **Payment Success Rate**: >95%

---

**Última Actualización:** $(date +%Y-%m-%d)
