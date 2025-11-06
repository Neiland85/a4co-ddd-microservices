# Payment Service - Documentación DDD

## Arquitectura

Este servicio implementa Domain-Driven Design (DDD) completo con las siguientes capas:

### Domain Layer (`src/domain/`)
- **Entities**: `Payment` - Aggregate Root
- **Value Objects**: `PaymentId`, `Money`, `StripePaymentIntent`, `PaymentStatus`
- **Domain Events**: `PaymentCreatedEvent`, `PaymentProcessingEvent`, `PaymentSucceededEvent`, `PaymentFailedEvent`, `PaymentRefundedEvent`
- **Domain Services**: `PaymentDomainService` - Validaciones de negocio
- **Repository Interfaces**: `IPaymentRepository`

### Application Layer (`src/application/`)
- **Use Cases**: 
  - `ProcessPaymentUseCase` - Procesa pagos
  - `RefundPaymentUseCase` - Maneja reembolsos (compensación)
- **Handlers**: `OrderEventsHandler` - Escucha eventos de Order Service

### Infrastructure Layer (`src/infrastructure/`)
- **Repositories**: `PrismaPaymentRepository` - Implementación con Prisma
- **Gateways**: `StripeGateway` - Integración con Stripe API

## Eventos de Dominio

### Eventos Publicados

1. **payment.created** - Cuando se crea un nuevo pago
2. **payment.processing** - Cuando el pago está siendo procesado
3. **payment.succeeded** - Cuando el pago se completa exitosamente
4. **payment.failed** - Cuando el pago falla
5. **payment.refunded** - Cuando se procesa un reembolso

### Eventos Escuchados

1. **order.created** - Inicia el procesamiento de pago
2. **order.cancelled** - Ejecuta compensación (reembolso)

## Flujo de Saga

```
Order Service → order.created → Payment Service
                                    ↓
                            ProcessPaymentUseCase
                                    ↓
                            Stripe Payment Intent
                                    ↓
                    ┌───────────────┴───────────────┐
                    ↓                               ↓
            payment.succeeded              payment.failed
                    ↓                               ↓
            Inventory Service              Order Service
```

### Compensación

Cuando se cancela una orden:
```
Order Service → order.cancelled → Payment Service
                                        ↓
                                RefundPaymentUseCase
                                        ↓
                                Stripe Refund
                                        ↓
                                payment.refunded
```

## Configuración

### Variables de Entorno

Ver `.env.example` para la lista completa de variables requeridas.

### Prisma Schema

El modelo `Payment` incluye:
- `id`: UUID del pago
- `orderId`: ID de la orden (único)
- `amount`: Monto del pago
- `currency`: Moneda (USD, EUR, etc.)
- `status`: Estado del pago
- `customerId`: ID del cliente
- `stripePaymentIntentId`: ID del Payment Intent de Stripe
- `stripeRefundId`: ID del reembolso de Stripe (si aplica)
- `failureReason`: Razón del fallo (si aplica)
- `metadata`: Metadatos adicionales (JSON)

## Uso

### Procesar un Pago

```typescript
const payment = await processPaymentUseCase.execute({
  orderId: 'order-123',
  amount: new Money(100, 'USD'),
  customerId: 'customer-456',
  metadata: { source: 'web' }
});
```

### Reembolsar un Pago

```typescript
const refundedPayment = await refundPaymentUseCase.execute({
  orderId: 'order-123',
  reason: 'requested_by_customer'
});
```

## Testing

Ejecutar tests:
```bash
npm test
```

Tests incluidos:
- Unit tests para entidades y value objects
- Integration tests para use cases
- Repository tests

## Integración con Stripe

El servicio usa Stripe Payment Intents API. Configurar:
- `STRIPE_SECRET_KEY` o `STRIPE_SECRET_KEY_TEST`
- `STRIPE_WEBHOOK_SECRET` (para webhooks)

## NATS JetStream

El servicio se conecta a NATS para:
- Escuchar eventos de Order Service
- Publicar eventos de dominio
- Participar en la saga distribuida

Configurar:
- `NATS_SERVERS`: URLs de servidores NATS (separadas por coma)
