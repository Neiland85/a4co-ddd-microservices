# Payment Service - DDD Implementation

## Descripción

Servicio de procesamiento de pagos implementado con Domain-Driven Design (DDD), integración con Stripe y comunicación asíncrona vía NATS JetStream.

## Arquitectura

### Capa de Dominio
- **Aggregates**: `Payment` - Aggregate root que encapsula la lógica de negocio de pagos
- **Value Objects**: 
  - `PaymentId` - Identificador único de pago
  - `Money` - Representación de montos con moneda
  - `StripePaymentIntent` - Validación de Payment Intent de Stripe
  - `PaymentStatus` - Estado del pago con transiciones válidas
- **Domain Events**:
  - `PaymentCreatedEvent`
  - `PaymentProcessingEvent`
  - `PaymentSucceededEvent`
  - `PaymentFailedEvent`
  - `PaymentRefundedEvent`
- **Domain Services**: `PaymentDomainService` - Validaciones de negocio complejas

### Capa de Aplicación
- **Use Cases**:
  - `ProcessPaymentUseCase` - Procesa un pago para una orden
  - `RefundPaymentUseCase` - Procesa reembolsos (compensación de saga)
- **Event Handlers**: `OrderEventsHandler` - Escucha eventos de orden desde NATS

### Capa de Infraestructura
- **Repositories**: `PrismaPaymentRepository` - Implementación con Prisma
- **Gateways**: `StripeGateway` - Integración con Stripe API
- **Event Publisher**: `NatsEventPublisher` - Publicación de eventos a NATS

## Eventos NATS

### Eventos que escucha:
- `order.created` - Inicia el procesamiento de pago
- `order.cancelled` - Ejecuta compensación (reembolso)

### Eventos que publica:
- `payment.created` - Pago creado
- `payment.processing` - Pago en procesamiento
- `payment.succeeded` - Pago exitoso
- `payment.failed` - Pago fallido
- `payment.refunded` - Pago reembolsado

## Configuración

### Variables de Entorno

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/payment_db

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# NATS
NATS_URL=nats://localhost:4222
NATS_AUTH_TOKEN=

# Application
PORT=3006
NODE_ENV=development
```

### Prisma

```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio
```

## Uso

### Procesar un Pago

El servicio escucha automáticamente eventos `order.created` desde NATS y procesa el pago.

### Reembolsar un Pago

El servicio escucha eventos `order.cancelled` y ejecuta automáticamente el reembolso.

## Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm test -- --coverage
```

## Estructura de Archivos

```
src/
├── domain/
│   ├── entities/
│   │   └── payment.entity.ts
│   ├── value-objects/
│   │   ├── payment-id.vo.ts
│   │   ├── money.vo.ts
│   │   ├── stripe-payment-intent.vo.ts
│   │   └── payment-status.vo.ts
│   ├── events/
│   │   └── payment.events.ts
│   ├── repositories/
│   │   └── payment.repository.ts
│   └── services/
│       └── payment-domain.service.ts
├── application/
│   ├── use-cases/
│   │   ├── process-payment.use-case.ts
│   │   └── refund-payment.use-case.ts
│   └── handlers/
│       └── order-events.handler.ts
└── infrastructure/
    ├── repositories/
    │   └── prisma-payment.repository.ts
    ├── stripe.gateway.ts
    ├── events/
    │   └── nats-event-publisher.ts
    └── database/
        └── prisma.service.ts
```

## Integración con Saga

Este servicio forma parte de la saga Order → Payment → Inventory:

1. **Order Service** publica `order.created`
2. **Payment Service** (este servicio) procesa el pago y publica `payment.succeeded` o `payment.failed`
3. **Inventory Service** reserva inventario basado en el resultado del pago
4. Si hay fallo, se ejecuta compensación: `order.cancelled` → reembolso

## Seguridad

- ✅ Validación de montos (no negativos, límites máximos)
- ✅ Validación de transiciones de estado
- ✅ Idempotencia en pagos (evita duplicados)
- ✅ Logs de auditoría de todas las transacciones
- ✅ Variables de entorno para secretos (no hardcodeados)
