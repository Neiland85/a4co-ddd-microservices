# Resumen de Estrategia de Integración

## 5. Comunicación entre Microservicios

### Decisiones Clave

1. **Comunicación Síncrona (REST)**: 
   - Consultas de información en tiempo real
   - Validaciones que bloquean el flujo
   - Operaciones que requieren confirmación inmediata

2. **Comunicación Asíncrona (Eventos)**:
   - Notificación de cambios de estado
   - Operaciones en background
   - Mantener consistencia eventual

### Eventos de Dominio Principales

| Servicio | Eventos Clave | Suscriptores |
|----------|---------------|--------------|
| User | `UserRegistered`, `EmailVerified` | Notification |
| Product | `StockUpdated`, `PriceChanged` | Order, Cart |
| Order | `OrderCreated`, `OrderConfirmed`, `OrderShipped` | Payment, Shipping, Notification |
| Payment | `PaymentProcessed`, `PaymentFailed` | Order, Notification |
| Cart | `CartAbandoned`, `CheckoutInitiated` | Notification, Order |
| Shipping | `ShipmentDispatched`, `ShipmentDelivered` | Order, Notification |

### Message Broker: NATS JetStream
- Alto rendimiento
- Persistencia de mensajes
- Delivery garantizado
- Fácil escalabilidad

## 6. Persistencia con Prisma ORM

### Esquema de Base de Datos - Product Service

#### Agregado Product
```
Product (Raíz del Agregado)
├── ProductVariant[] (Entidades)
│   ├── Inventory (Value Object)
│   ├── StockReservation[] (Entidades)
│   └── VariantAttribute[] (Value Objects)
├── ProductImage[] (Value Objects)
└── ProductAttribute[] (Value Objects)
```

#### Agregado Category
```
Category (Raíz del Agregado)
├── Category[] (Sub-categorías)
└── CategoryAttribute[] (Value Objects)
```

### Características del Diseño

1. **Integridad del Agregado**:
   - Cascada de eliminación en entidades hijas
   - Transacciones para operaciones complejas
   - Índices para consultas frecuentes

2. **Gestión de Stock**:
   - Reservas con expiración
   - Movimientos auditados
   - Cantidad disponible = cantidad - reservada

3. **Repositorio DDD**:
   - Mapeo entre dominio y persistencia
   - Transacciones con event sourcing
   - Métodos específicos del dominio

### Patrones Implementados

1. **Repository Pattern**: Abstracción de la persistencia
2. **Unit of Work**: Transacciones con Prisma
3. **Event Sourcing**: Almacenamiento de eventos de dominio
4. **Optimistic Locking**: Control de concurrencia con `updatedAt`

### Ejemplo de Uso

```typescript
// Reservar stock para una orden
const reservationId = await productRepo.reserveStock(
  variantId, 
  quantity, 
  orderId,
  30 // minutos de expiración
);

// Guardar producto con eventos
await productRepo.save(product);
// Eventos automáticamente almacenados
```

## Beneficios de la Arquitectura

1. **Escalabilidad**: Cada servicio escala independientemente
2. **Resiliencia**: Circuit breakers y reintentos
3. **Consistencia**: Eventual entre servicios, fuerte dentro de agregados
4. **Trazabilidad**: Eventos y correlation IDs
5. **Mantenibilidad**: Dominios bien definidos y bajo acoplamiento