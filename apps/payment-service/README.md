# Payment Service

Servicio de procesamiento de pagos para la plataforma A4CO, implementado con DDD (Domain-Driven Design), CQRS y Saga Pattern.

## Arquitectura

El servicio sigue los principios de DDD con las siguientes capas:

- **Domain**: Entidades, Value Objects, Domain Events, Domain Services
- **Application**: Use Cases, Event Handlers
- **Infrastructure**: Repositories (Prisma), Stripe Gateway, NATS Event Bus
- **Presentation**: Controllers REST

## Eventos de Dominio

### Eventos Publicados

El servicio publica los siguientes eventos a NATS:

#### `payment.created`
Publicado cuando se crea un nuevo pago.

```typescript
{
  eventId: string;
  eventType: "PaymentCreatedEvent";
  timestamp: Date;
  data: {
    orderId: string;
    amount: { amount: number; currency: string };
    customerId: string;
    createdAt: Date;
  };
  aggregateId: string;
  sagaId?: string;
}
```

#### `payment.processing`
Publicado cuando el pago comienza a procesarse.

```typescript
{
  eventId: string;
  eventType: "PaymentProcessingEvent";
  timestamp: Date;
  data: {
    orderId: string;
    amount: { amount: number; currency: string };
    processedAt: Date;
  };
  aggregateId: string;
  sagaId?: string;
}
```

#### `payment.succeeded`
Publicado cuando el pago se completa exitosamente.

```typescript
{
  eventId: string;
  eventType: "PaymentSucceededEvent";
  timestamp: Date;
  data: {
    orderId: string;
    amount: { amount: number; currency: string };
    stripePaymentIntentId: string;
    succeededAt: Date;
  };
  aggregateId: string;
  sagaId?: string;
}
```

#### `payment.failed`
Publicado cuando el pago falla.

```typescript
{
  eventId: string;
  eventType: "PaymentFailedEvent";
  timestamp: Date;
  data: {
    orderId: string;
    amount: { amount: number; currency: string };
    reason: string;
    failedAt: Date;
  };
  aggregateId: string;
  sagaId?: string;
}
```

#### `payment.refunded`
Publicado cuando se reembolsa un pago (compensación).

```typescript
{
  eventId: string;
  eventType: "PaymentRefundedEvent";
  timestamp: Date;
  data: {
    orderId: string;
    amount: { amount: number; currency: string };
    refundAmount: { amount: number; currency: string };
    refundedAt: Date;
  };
  aggregateId: string;
  sagaId?: string;
}
```

### Eventos Escuchados

El servicio escucha los siguientes eventos de otros servicios:

#### `order.created`
Cuando se crea una nueva orden, el servicio procesa el pago automáticamente.

```typescript
{
  orderId: string;
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    currency?: string;
  }>;
  totalAmount: number;
  currency?: string;
  sagaId?: string;
}
```

#### `order.cancelled`
Cuando se cancela una orden, el servicio reembolsa el pago (compensación de saga).

```typescript
{
  orderId: string;
  reason?: string;
  sagaId?: string;
}
```

## Integración con Stripe

El servicio utiliza Stripe como gateway de pagos. Configuración requerida:

- `STRIPE_SECRET_KEY`: Clave secreta de Stripe (modo sandbox: `sk_test_...`)
- `STRIPE_WEBHOOK_SECRET`: Secreto del webhook de Stripe (opcional)

### Características

- Payment Intents (no cargos directos)
- Idempotencia usando `orderId`
- Soporte para reembolsos completos y parciales
- Manejo de webhooks de Stripe

## Límites de Transacción

- **Mínimo**: 0.50 EUR/USD
- **Máximo**: 10,000 EUR/USD
- **Monedas soportadas**: EUR, USD

## Variables de Entorno

Ver `.env.example` para la lista completa de variables de entorno requeridas.

## Estructura del Proyecto

```
src/
├── domain/
│   ├── entities/
│   │   └── payment.entity.ts          # Payment Aggregate
│   ├── value-objects/
│   │   ├── payment-id.vo.ts
│   │   ├── money.vo.ts
│   │   ├── stripe-payment-intent.vo.ts
│   │   └── payment-status.vo.ts
│   ├── events/
│   │   └── payment-events.ts          # Domain Events
│   ├── repositories/
│   │   └── payment.repository.ts      # Repository Interface
│   └── services/
│       └── payment-domain.service.ts   # Domain Service
├── application/
│   ├── use-cases/
│   │   ├── process-payment.use-case.ts
│   │   └── refund-payment.use-case.ts
│   └── handlers/
│       └── order-events.handler.ts    # NATS Event Handlers
├── infrastructure/
│   ├── repositories/
│   │   └── prisma-payment.repository.ts
│   └── stripe.gateway.ts
└── presentation/
    └── payment.controller.ts
```

## Tests

Ejecutar tests:

```bash
npm test
```

Los tests incluyen:
- Tests unitarios del Payment Aggregate
- Tests unitarios de Use Cases
- Tests de integración (requieren DB y NATS)

## Flujo de Saga

El servicio participa en la saga Order → Payment → Inventory:

1. **Order Service** publica `order.created`
2. **Payment Service** escucha el evento y procesa el pago
3. **Payment Service** publica `payment.succeeded` o `payment.failed`
4. Si la orden se cancela, **Order Service** publica `order.cancelled`
5. **Payment Service** escucha `order.cancelled` y reembolsa el pago

## Notas de Implementación

- Los eventos de dominio se publican automáticamente después de guardar el aggregate
- Se implementa idempotencia para evitar pagos duplicados
- Los reembolsos son automáticos cuando se cancela una orden (compensación de saga)
- Todos los eventos incluyen `sagaId` para trazabilidad en la saga distribuida
