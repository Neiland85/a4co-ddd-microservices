# Payment Service

Servicio de procesamiento de pagos para la plataforma A4CO implementado con DDD, CQRS y Saga Pattern.

## Arquitectura

El servicio sigue los principios de Domain-Driven Design (DDD) con:

- **Domain Layer**: Aggregates, Value Objects, Domain Events, Domain Services
- **Application Layer**: Use Cases, Event Handlers
- **Infrastructure Layer**: Repositories (Prisma), Stripe Gateway, NATS Integration
- **Presentation Layer**: REST Controllers, NATS Event Handlers

## Eventos de Dominio

El servicio publica los siguientes eventos a NATS:

- `payment.paymentcreatedevent` - Cuando se crea un nuevo pago
- `payment.paymentprocessingevent` - Cuando el pago comienza a procesarse
- `payment.paymentsucceededevent` - Cuando el pago se completa exitosamente
- `payment.paymentfailedevent` - Cuando el pago falla
- `payment.paymentrefundedevent` - Cuando se procesa un reembolso

## Eventos Escuchados

El servicio escucha los siguientes eventos de NATS:

- `order.created` - Inicia el procesamiento de pago para una orden
- `order.cancelled` - Procesa el reembolso de un pago (compensación de saga)

## Flujo de Saga

1. **Order Service** publica `order.created`
2. **Payment Service** recibe el evento y crea un Payment aggregate
3. Se crea un Payment Intent en Stripe
4. Se confirma el pago automáticamente (en producción esto se hace desde el frontend)
5. Se publica `payment.succeeded` o `payment.failed`
6. Si la orden se cancela, se publica `order.cancelled` y se procesa el reembolso

## Configuración

1. Copiar `.env.example` a `.env` y configurar las variables
2. Ejecutar migraciones de Prisma: `npx prisma migrate dev`
3. Generar cliente de Prisma: `npx prisma generate`
4. Iniciar el servicio: `npm run start:dev`

## Testing

```bash
# Tests unitarios
npm test

# Tests de integración
npm run test:integration
```

## Estructura del Proyecto

```
src/
├── domain/
│   ├── entities/          # Aggregates
│   ├── value-objects/     # Value Objects
│   ├── events/           # Domain Events
│   ├── repositories/     # Repository interfaces
│   └── services/         # Domain Services
├── application/
│   ├── use-cases/        # Use Cases
│   └── handlers/         # Event Handlers
├── infrastructure/
│   ├── repositories/     # Prisma implementations
│   ├── stripe.gateway.ts # Stripe integration
│   └── nats/             # NATS configuration
└── presentation/
    └── payment.controller.ts # REST API
```
