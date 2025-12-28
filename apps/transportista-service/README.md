# Transportista Service

NestJS microservice for managing shipments and transportistas in the A4CO DDD platform.

## 🏗️ Architecture

This service follows hexagonal architecture (ports and adapters) with clear separation of concerns:

```
src/
├── domain/              # Business logic
│   ├── aggregates/      # Shipment, Transportista entities
│   ├── events/          # Domain events (versioned)
│   └── repositories/    # Repository interfaces (ports)
├── application/         # Use cases
│   ├── use-cases/       # CreateShipment, AssignShipment, UpdateStatus
│   └── strategies/      # Assignment strategies
├── infrastructure/      # External concerns
│   ├── prisma/          # Database access
│   ├── repositories/    # Prisma implementations
│   └── event-handlers/  # NATS event listeners
└── presentation/        # API layer
    ├── controllers/     # REST endpoints
    └── dto/             # Request/response DTOs
```

## 🚛 Domain Model

### Shipment Aggregate

State machine: `PENDING → ASSIGNED → IN_TRANSIT → DELIVERED / FAILED`

**Invariants:**
- Cannot assign transportista to non-PENDING shipment
- Cannot mark as in-transit without transportista
- Cannot mark as delivered without being in-transit
- Can mark as failed from any status except DELIVERED

### Transportista Entity

Manages delivery personnel with metrics:
- Total shipments
- Successful deliveries
- Average delivery time
- Rating (0-5)
- Service areas

## 📡 Events

### Published Events (v1)

- `shipment.created.v1` - New shipment created
- `shipment.assigned.v1` - Transportista assigned
- `shipment.in_transit.v1` - Shipment picked up
- `shipment.delivered.v1` - Delivery completed
- `shipment.failed.v1` - Assignment/delivery failed

### Consumed Events (v1)

- `order.confirmed.v1` - Triggers shipment creation and auto-assignment

## 🔌 REST API (v1)

Base path: `/api/v1/shipments`

### Endpoints

```
POST   /                    Create shipment
GET    /:id                 Get shipment by ID
GET    /order/:orderId      Get shipment by order ID
PATCH  /:id/assign          Assign transportista
PATCH  /:id/status          Update status
```

### Example: Create Shipment

```bash
curl -X POST http://localhost:3008/api/v1/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-123",
    "pickupAddress": "Warehouse A, Málaga",
    "deliveryAddress": "Customer St 123, Sevilla",
    "shippingCost": 15.50,
    "metadata": {
      "weight": 5.2,
      "notes": "Handle with care"
    }
  }'
```

### Example: Update Status

```bash
curl -X PATCH http://localhost:3008/api/v1/shipments/{id}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_TRANSIT"
  }'
```

## 🗄️ Database Schema

### Shipment Table

```prisma
model Shipment {
  id                    String
  orderId               String   @unique
  transportistaId       String?
  status                String   // PENDING, ASSIGNED, IN_TRANSIT, DELIVERED, FAILED
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

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- NATS server
- pnpm

### Installation

```bash
# Install dependencies (from root)
pnpm install

# Generate Prisma client
cd apps/transportista-service
pnpm prisma:generate

# Run database migrations
pnpm prisma migrate dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/transportista_db
NATS_URL=nats://localhost:4222
PORT=3008
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Running the Service

```bash
# Development mode
pnpm start:dev

# Production mode
pnpm build
pnpm start

# Tests
pnpm test
pnpm test:cov
```

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
pnpm test

# With coverage
pnpm test:cov
```

### Integration Tests

Test the full flow: Create → Assign → Transit → Deliver

```bash
pnpm test:e2e
```

### Key Test Scenarios

1. **State Machine Tests**: Validate all state transitions
2. **Domain Events Tests**: Verify events are emitted correctly
3. **Business Rules Tests**: Test delayed detection, cancellation rules
4. **Integration Tests**: End-to-end shipment lifecycle
5. **Event Handler Tests**: OrderConfirmed triggers shipment creation

## 🐳 Docker

### Build Image

```bash
docker build -t a4co/transportista-service:latest .
```

### Run Container

```bash
docker run -p 3008:3008 \
  -e DATABASE_URL="postgresql://..." \
  -e NATS_URL="nats://nats:4222" \
  a4co/transportista-service:latest
```

### Docker Compose

```yaml
transportista-service:
  build: ./apps/transportista-service
  ports:
    - "3008:3008"
  environment:
    DATABASE_URL: postgresql://postgres:password@postgres:5432/transportista_db
    NATS_URL: nats://nats:4222
    PORT: 3008
  depends_on:
    - postgres
    - nats
```

## 🔍 Monitoring

- **Swagger**: http://localhost:3008/api/docs
- **Health**: http://localhost:3008/health (to be implemented)
- **Metrics**: Prometheus metrics via @a4co/observability

## 🎯 Assignment Strategies

### Current: Random Assignment

Randomly selects an active transportista.

### Future Strategies

- **LoadBalanced**: Distribute based on current workload
- **Geolocation**: Select nearest transportista to pickup
- **Performance**: Prioritize high-rated transportistas
- **ServiceArea**: Match by service area coverage

## 📊 Key Metrics

- Shipments created/assigned/delivered
- Average assignment time
- Average delivery time
- Failure rate
- Transportista utilization

## 🔐 Security

- Input validation via class-validator
- CORS configuration
- Helmet middleware for HTTP headers
- Database connection encryption (TLS)

## 🤝 Integration with Other Services

- **Order Service**: Listens to `order.confirmed.v1`
- **Notification Service**: Emits events for customer notifications
- **Saga Orchestrator**: Participates in order fulfillment saga

## 📝 Notes

- Shipments are automatically assigned on order confirmation
- Failed assignments leave shipment in PENDING for manual retry
- Transportista metrics updated on successful delivery
- Events follow versioning pattern (v1, v2, etc.)

## 🔮 Future Enhancements

- Real-time tracking integration
- Route optimization
- Multi-package shipments
- Return shipments handling
- SLA monitoring and alerts
- Advanced assignment algorithms
