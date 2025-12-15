# Transportista Service - Architecture & Integration Guide

## Overview

The Transportista Service manages the logistics layer of the A4CO platform, handling shipment creation, transportista assignment, and delivery tracking. It integrates with the order fulfillment saga to automatically initiate shipments when orders are confirmed.

## Architecture

### Hexagonal Architecture (Ports & Adapters)

```
┌──────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                     │
│  REST API (Controllers, DTOs) + Event Handlers (NATS)   │
└──────────────────┬───────────────────┬───────────────────┘
                   │                   │
┌──────────────────▼───────────────────▼───────────────────┐
│                   APPLICATION LAYER                       │
│  Use Cases: CreateShipment, AssignShipment, UpdateStatus│
│  Strategies: RandomAssignment (extensible interface)     │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                     DOMAIN LAYER                         │
│  Aggregates: Shipment (state machine), Transportista    │
│  Events: shipment.created/assigned/in_transit/delivered │
│  Repositories: ShipmentRepository, TransportistaRepo    │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                     │
│  Prisma Repositories + NATS Event Handlers              │
└──────────────────────────────────────────────────────────┘
```

## Domain Model

### Shipment Aggregate - State Machine

```
PENDING ──assign()──> ASSIGNED ──markInTransit()──> IN_TRANSIT ──markDelivered()──> DELIVERED
   │                     │                               │
   └──────────markFailed()────────────────────────────────────────────> FAILED
```

**Business Rules:**
- Only PENDING shipments can be assigned
- Only ASSIGNED shipments can transition to IN_TRANSIT
- Only IN_TRANSIT shipments can be marked as DELIVERED
- Can mark as FAILED from any status except DELIVERED
- Cannot change status of DELIVERED shipments

### Transportista Entity

Represents delivery personnel with performance metrics:
- **totalShipments**: Total number of assigned deliveries
- **successfulShipments**: Successfully completed deliveries
- **averageDeliveryTime**: Average time to complete delivery (hours)
- **rating**: Performance rating (0-5)
- **serviceAreas**: Geographic areas covered

## Event-Driven Integration

### Published Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `shipment.created.v1` | Shipment created | shipmentId, orderId, addresses, cost |
| `shipment.assigned.v1` | Transportista assigned | shipmentId, transportistaId, ETA |
| `shipment.in_transit.v1` | Pickup completed | shipmentId, transportistaId |
| `shipment.delivered.v1` | Delivery completed | shipmentId, actualDeliveryTime |
| `shipment.failed.v1` | Assignment/delivery failed | shipmentId, reason |

### Consumed Events

| Event | Handler | Action |
|-------|---------|--------|
| `order.confirmed.v1` | OrderEventsHandler | Create shipment + auto-assign transportista |

### Event Flow Example

```mermaid
sequenceDiagram
    participant O as Order Service
    participant NATS
    participant T as Transportista Service
    participant N as Notification Service

    O->>NATS: order.confirmed.v1
    NATS->>T: Deliver event
    T->>T: Create shipment (PENDING)
    T->>T: Assign transportista (→ ASSIGNED)
    T->>NATS: shipment.assigned.v1
    NATS->>N: Notify customer
```

## REST API (v1)

Base URL: `http://localhost:3008/api/v1/shipments`

### Endpoints

#### Create Shipment
```http
POST /api/v1/shipments
Content-Type: application/json

{
  "orderId": "order-123",
  "pickupAddress": "Warehouse A, Málaga",
  "deliveryAddress": "Customer St 123, Sevilla",
  "shippingCost": 15.50,
  "metadata": {
    "weight": 5.2,
    "notes": "Handle with care"
  }
}
```

**Response**: `201 Created` with ShipmentResponseDto

#### Get Shipment by ID
```http
GET /api/v1/shipments/:id
```

**Response**: `200 OK` with ShipmentResponseDto

#### Get Shipment by Order ID
```http
GET /api/v1/shipments/order/:orderId
```

**Response**: `200 OK` with ShipmentResponseDto

#### Assign Transportista
```http
PATCH /api/v1/shipments/:id/assign
```

**Response**: `200 OK` with updated ShipmentResponseDto

#### Update Shipment Status
```http
PATCH /api/v1/shipments/:id/status
Content-Type: application/json

{
  "status": "IN_TRANSIT"
}
```

**Response**: `200 OK` with updated ShipmentResponseDto

## Assignment Strategies

### Current: RandomAssignmentStrategy

Selects a random active transportista from available pool.

### Future Strategies (Pluggable)

- **LoadBalancedStrategy**: Distribute based on current workload
- **GeolocationStrategy**: Select nearest transportista to pickup location
- **PerformanceStrategy**: Prioritize high-rated transportistas
- **ServiceAreaStrategy**: Match by service area coverage

Interface: `AssignmentStrategy` allows easy implementation of new strategies.

## Database Schema

### Shipment Table
```prisma
model Shipment {
  id                    String
  orderId               String   @unique
  transportistaId       String?
  status                String
  shippingCost          Decimal
  pickupAddress         String
  deliveryAddress       String
  estimatedDeliveryTime DateTime?
  actualDeliveryTime    DateTime?
  failureReason         String?
  metadata              Json?
  createdAt             DateTime
  updatedAt             DateTime
}
```

### Transportista Table
```prisma
model Transportista {
  id                   String
  name                 String
  email                String   @unique
  phone                String
  serviceAreas         String[]
  totalShipments       Int
  successfulShipments  Int
  averageDeliveryTime  Float?
  rating               Float?
  isActive             Boolean
  createdAt            DateTime
  updatedAt            DateTime
}
```

## Testing

### Unit Tests
```bash
cd apps/transportista-service
pnpm test
```

**Coverage**: ShipmentAggregate state transitions, domain events

### Integration Tests (To be implemented)
- Full shipment lifecycle: Create → Assign → Transit → Deliver
- Event handler integration with NATS
- Repository persistence with Prisma

## Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/transportista_db
NATS_URL=nats://localhost:4222
PORT=3008
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
```

### Docker
```bash
docker build -t a4co/transportista-service:latest apps/transportista-service
docker run -p 3008:3008 \
  -e DATABASE_URL="postgresql://..." \
  -e NATS_URL="nats://nats:4222" \
  a4co/transportista-service:latest
```

### Docker Compose Integration
```yaml
transportista-service:
  build: ./apps/transportista-service
  ports:
    - "3008:3008"
  environment:
    DATABASE_URL: ${TRANSPORTISTA_DATABASE_URL}
    NATS_URL: nats://nats:4222
  depends_on:
    - postgres
    - nats
```

## Monitoring & Observability

- **Swagger UI**: http://localhost:3008/api/docs
- **Health Check**: http://localhost:3008/health (to be implemented)
- **Logs**: Structured logging via @a4co/observability
- **Metrics**: Prometheus metrics (to be implemented)
- **Tracing**: OpenTelemetry integration via shared-utils

## Future Enhancements

1. **Real-time Tracking**: GPS integration for live location updates
2. **Route Optimization**: Calculate optimal delivery routes
3. **SLA Monitoring**: Track and alert on delivery SLA breaches
4. **Multi-package Shipments**: Support for multiple packages per shipment
5. **Return Handling**: Support for return shipments
6. **Performance Analytics**: Dashboard for transportista performance metrics
7. **Advanced Assignment**: ML-based assignment considering multiple factors

## References

- **Service Code**: `apps/transportista-service/`
- **API Documentation**: Swagger UI at `/api/docs`
- **Domain Events**: `packages/shared-events/`
- **Related ADRs**: `docs/adr/` (to be created)

---

*Last Updated: 2025-01-15*
*Version: 1.0.0*
