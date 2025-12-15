# @a4co/shared-events

Librería compartida de tipos de eventos para la arquitectura event-driven con NATS.

## 📦 Instalación

```bash
npm install @a4co/shared-events
```

## 🎯 Uso

### Importar Eventos

```typescript
import {
  OrderCreatedEvent,
  PaymentConfirmedEvent,
  InventoryReservedEvent,
  SagaCompletedEvent,
} from '@a4co/shared-events'
```

### Usar Constants

```typescript
import { EVENT_PATTERNS } from '@a4co/shared-events'

// En listeners de NATS
@EventPattern(EVENT_PATTERNS.ORDER_CREATED)
handleOrderCreated(event: OrderCreatedEvent) {
  // ...
}

// En publishers
await eventPublisher.publish(EVENT_PATTERNS.PAYMENT_CONFIRMED, event)
```

## 📚 Event Types

### Order Events
- `OrderCreatedEvent`: Cuando se crea una nueva orden
- `OrderCancelledEvent`: Cuando se cancela una orden

### Payment Events
- `PaymentConfirmedEvent`: Cuando el pago se procesa exitosamente
- `PaymentFailedEvent`: Cuando el pago falla

### Inventory Events
- `InventoryReservedEvent`: Cuando se reserva stock exitosamente
- `InventoryFailedEvent`: Cuando falla la reserva de stock

### Saga Events
- `SagaStartedEvent`: Cuando inicia la orquestación
- `SagaCompletedEvent`: Cuando se completa exitosamente
- `SagaFailedEvent`: Cuando falla
- `SagaCompensationRequiredEvent`: Cuando se requieren compensaciones

## 🔄 Versionado

Todos los eventos incluyen un campo `version` para permitir evolución futura:

```typescript
interface BaseEvent {
  eventId: string      // UUID único
  version: number      // Versión para compatibilidad
  timestamp: Date      // Timestamp ISO 8601
}
```

## 📖 Ejemplo Completo

```typescript
import { v4 as uuid } from 'uuid'
import { OrderCreatedEvent, EVENT_PATTERNS } from '@a4co/shared-events'

// Crear evento
const event: OrderCreatedEvent = {
  eventId: uuid(),
  orderId: 'order-123',
  userId: 'user-456',
  productId: 'prod-789',
  quantity: 2,
  totalAmount: 100,
  timestamp: new Date(),
  version: 1,
}

// Publicar
await publisher.publish(EVENT_PATTERNS.ORDER_CREATED, event)
```

## ⚙️ Configuración en Servicios

En `tsconfig.json` de cada servicio:

```json
{
  "compilerOptions": {
    "paths": {
      "@a4co/shared-events": ["../../libs/shared-events/src"]
    }
  }
}
```

O en `package.json` después de compilar:

```json
{
  "dependencies": {
    "@a4co/shared-events": "file:../../libs/shared-events"
  }
}
```
