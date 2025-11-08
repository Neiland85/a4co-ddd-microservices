# PROMPT PARA AGENTE CURSOR #10 - Event Sourcing Completo

## ROL
Eres un experto en Event Sourcing, CQRS avanzado, y Event Store. Tu tarea es implementar Event Sourcing completo con persistencia de eventos, proyecciones, y replay capability.

## CONTEXTO DEL PROYECTO
- Eventos de dominio se crean pero NO se persisten
- No hay Event Store
- No hay proyecciones
- No hay replay de eventos
- Referencia: Order Service tiene eventos definidos

## ESTADO ACTUAL
✅ **Existente**:
- Domain Events: OrderCreatedEvent, PaymentSucceededEvent, etc.
- Event publishing a NATS
- Aggregates emiten eventos

❌ **Falta**:
- Persistir eventos en Event Store
- Proyecciones para read models
- Snapshot strategy
- Event replay
- Event versioning
- Outbox pattern para garantías transaccionales

## TECNOLOGÍAS A USAR

### Opción A: EventStoreDB (Recomendado)
```bash
docker run -d --name eventstoredb \
  -p 2113:2113 -p 1113:1113 \
  eventstore/eventstore:latest \
  --insecure --run-projections=All
```

### Opción B: PostgreSQL + Outbox Pattern
Tabla de eventos en PostgreSQL con outbox para publicación garantizada

## TAREAS A REALIZAR

### 1. Crear Event Store Adapter
**Directorio**: `packages/event-sourcing/`

**Estructura**:
```
packages/event-sourcing/
├── src/
│   ├── index.ts
│   ├── event-store.module.ts
│   ├── adapters/
│   │   ├── event-store-db.adapter.ts
│   │   └── postgres-event-store.adapter.ts
│   ├── interfaces/
│   │   ├── event-store.interface.ts
│   │   ├── projection.interface.ts
│   │   └── snapshot.interface.ts
│   ├── projections/
│   │   ├── projection-manager.ts
│   │   └── projection-runner.ts
│   └── snapshots/
│       ├── snapshot-manager.ts
│       └── snapshot-strategy.ts
└── package.json
```

**Archivo**: `packages/event-sourcing/src/interfaces/event-store.interface.ts`

```typescript
export interface IEventStore {
  // Append events to stream
  appendToStream(
    streamName: string,
    events: DomainEvent[],
    expectedVersion: number,
  ): Promise<void>;

  // Read events from stream
  readStream(
    streamName: string,
    fromVersion?: number,
  ): Promise<DomainEvent[]>;

  // Read all events (for projections)
  readAllEvents(
    fromPosition?: number,
    maxCount?: number,
  ): Promise<DomainEvent[]>;

  // Subscribe to stream
  subscribeToStream(
    streamName: string,
    handler: (event: DomainEvent) => Promise<void>,
  ): Promise<void>;

  // Subscribe to all events
  subscribeToAll(
    handler: (event: DomainEvent) => Promise<void>,
  ): Promise<void>;

  // Check if stream exists
  streamExists(streamName: string): Promise<boolean>;

  // Get stream metadata
  getStreamMetadata(streamName: string): Promise<StreamMetadata>;
}

export interface StreamMetadata {
  streamName: string;
  version: number;
  createdAt: Date;
  lastUpdatedAt: Date;
  eventCount: number;
}

export interface DomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  version: number;
  timestamp: Date;
  data: any;
  metadata?: any;
}
```

### 2. Implementar EventStoreDB Adapter
**Archivo**: `packages/event-sourcing/src/adapters/event-store-db.adapter.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { IEventStore, DomainEvent, StreamMetadata } from '../interfaces/event-store.interface';

@Injectable()
export class EventStoreDBAdapter implements IEventStore {
  private client: EventStoreDBClient;

  constructor() {
    this.client = EventStoreDBClient.connectionString(
      process.env.EVENTSTORE_CONNECTION_STRING ||
      'esdb://localhost:2113?tls=false',
    );
  }

  async appendToStream(
    streamName: string,
    events: DomainEvent[],
    expectedVersion: number,
  ): Promise<void> {
    const eventStoreEvents = events.map((event) =>
      jsonEvent({
        id: event.eventId,
        type: event.eventType,
        data: {
          aggregateId: event.aggregateId,
          version: event.version,
          ...event.data,
        },
        metadata: {
          timestamp: event.timestamp,
          ...event.metadata,
        },
      }),
    );

    await this.client.appendToStream(streamName, eventStoreEvents, {
      expectedRevision: expectedVersion === -1 ? 'no_stream' : expectedVersion,
    });
  }

  async readStream(
    streamName: string,
    fromVersion: number = 0,
  ): Promise<DomainEvent[]> {
    const events: DomainEvent[] = [];

    try {
      const stream = this.client.readStream(streamName, {
        fromRevision: fromVersion,
      });

      for await (const resolvedEvent of stream) {
        if (resolvedEvent.event) {
          events.push(this.mapToDomainEvent(resolvedEvent.event));
        }
      }
    } catch (error) {
      if (error.type === 'stream-not-found') {
        return [];
      }
      throw error;
    }

    return events;
  }

  async readAllEvents(
    fromPosition: number = 0,
    maxCount: number = 1000,
  ): Promise<DomainEvent[]> {
    const events: DomainEvent[] = [];

    const stream = this.client.readAll({
      fromPosition: { commit: fromPosition, prepare: fromPosition },
      maxCount,
    });

    for await (const resolvedEvent of stream) {
      if (resolvedEvent.event) {
        events.push(this.mapToDomainEvent(resolvedEvent.event));
      }
    }

    return events;
  }

  async subscribeToStream(
    streamName: string,
    handler: (event: DomainEvent) => Promise<void>,
  ): Promise<void> {
    const subscription = this.client.subscribeToStream(streamName);

    for await (const resolvedEvent of subscription) {
      if (resolvedEvent.event) {
        const domainEvent = this.mapToDomainEvent(resolvedEvent.event);
        await handler(domainEvent);
      }
    }
  }

  async subscribeToAll(
    handler: (event: DomainEvent) => Promise<void>,
  ): Promise<void> {
    const subscription = this.client.subscribeToAll();

    for await (const resolvedEvent of subscription) {
      if (resolvedEvent.event && !resolvedEvent.event.type.startsWith('$')) {
        const domainEvent = this.mapToDomainEvent(resolvedEvent.event);
        await handler(domainEvent);
      }
    }
  }

  async streamExists(streamName: string): Promise<boolean> {
    try {
      await this.client.getStreamMetadata(streamName);
      return true;
    } catch (error) {
      if (error.type === 'stream-not-found') {
        return false;
      }
      throw error;
    }
  }

  async getStreamMetadata(streamName: string): Promise<StreamMetadata> {
    const metadata = await this.client.getStreamMetadata(streamName);

    return {
      streamName,
      version: Number(metadata.streamRevision),
      createdAt: new Date(), // EventStoreDB doesn't provide this directly
      lastUpdatedAt: new Date(),
      eventCount: Number(metadata.streamRevision) + 1,
    };
  }

  private mapToDomainEvent(eventStoreEvent: any): DomainEvent {
    return {
      eventId: eventStoreEvent.id,
      eventType: eventStoreEvent.type,
      aggregateId: eventStoreEvent.data.aggregateId,
      aggregateType: this.extractAggregateType(eventStoreEvent.streamId),
      version: eventStoreEvent.data.version || 0,
      timestamp: new Date(eventStoreEvent.metadata.timestamp),
      data: eventStoreEvent.data,
      metadata: eventStoreEvent.metadata,
    };
  }

  private extractAggregateType(streamId: string): string {
    // Stream format: "Order-{aggregateId}" -> "Order"
    return streamId.split('-')[0];
  }
}
```

### 3. Implementar Repository con Event Sourcing
**Archivo**: `apps/order-service/src/infrastructure/repositories/event-sourced-order.repository.ts`

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { IEventStore, DomainEvent } from '@a4co/event-sourcing';
import { Order, OrderStatus, OrderItem } from '../../domain/aggregates/order.aggregate';
import { IOrderRepository } from '../../domain/repositories/order.repository';
import { OrderId } from '../../domain/value-objects/order-id.vo';

@Injectable()
export class EventSourcedOrderRepository implements IOrderRepository {
  constructor(
    @Inject('EVENT_STORE') private readonly eventStore: IEventStore,
  ) {}

  async save(order: Order): Promise<void> {
    const streamName = this.getStreamName(order.id);
    const events = order.getDomainEvents();

    if (events.length === 0) {
      return; // No events to save
    }

    // Map domain events to event store format
    const eventStoreEvents = events.map((event, index) => ({
      eventId: this.generateEventId(),
      eventType: event.eventName,
      aggregateId: order.id,
      aggregateType: 'Order',
      version: order.version + index,
      timestamp: new Date(),
      data: event,
      metadata: {
        userId: event.metadata?.userId,
        correlationId: event.metadata?.correlationId,
      },
    }));

    // Append to stream
    await this.eventStore.appendToStream(
      streamName,
      eventStoreEvents,
      order.version - 1, // Expected version before new events
    );

    // Clear events after successful save
    order.clearDomainEvents();
  }

  async findById(orderId: OrderId): Promise<Order | null> {
    const streamName = this.getStreamName(orderId.value);

    // Check if stream exists
    const exists = await this.eventStore.streamExists(streamName);
    if (!exists) {
      return null;
    }

    // Read all events for this order
    const events = await this.eventStore.readStream(streamName);

    if (events.length === 0) {
      return null;
    }

    // Rebuild order from events
    return this.rebuildOrderFromEvents(events);
  }

  async findAll(): Promise<Order[]> {
    // Note: This is inefficient for event sourcing
    // Better to use projections for queries
    throw new Error('Use projections for querying multiple orders');
  }

  private rebuildOrderFromEvents(events: DomainEvent[]): Order {
    // Start with first event (OrderCreatedEvent)
    const firstEvent = events[0];

    if (firstEvent.eventType !== 'order.created.v1') {
      throw new Error('First event must be OrderCreatedEvent');
    }

    const data = firstEvent.data;
    let order = new Order(
      data.orderId,
      data.customerId,
      data.items.map((item: any) => new OrderItem(
        item.productId,
        item.quantity,
        item.unitPrice,
        item.currency,
      )),
    );

    // Apply subsequent events
    for (let i = 1; i < events.length; i++) {
      order = this.applyEvent(order, events[i]);
    }

    return order;
  }

  private applyEvent(order: Order, event: DomainEvent): Order {
    switch (event.eventType) {
      case 'order.status.changed.v1':
        order.changeStatus(event.data.newStatus as OrderStatus);
        break;

      case 'order.item.added.v1':
        order.addItem(
          new OrderItem(
            event.data.productId,
            event.data.quantity,
            event.data.unitPrice,
            event.data.currency,
          ),
        );
        break;

      case 'order.item.removed.v1':
        order.removeItem(event.data.productId);
        break;

      // Add more event types as needed
      default:
        console.warn(`Unknown event type: ${event.eventType}`);
    }

    return order;
  }

  private getStreamName(orderId: string): string {
    return `Order-${orderId}`;
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
}
```

### 4. Implementar Projection Manager
**Archivo**: `packages/event-sourcing/src/projections/projection-manager.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { IEventStore, DomainEvent } from '../interfaces/event-store.interface';
import { IProjection } from '../interfaces/projection.interface';

@Injectable()
export class ProjectionManager {
  private readonly logger = new Logger(ProjectionManager.name);
  private projections: Map<string, IProjection> = new Map();
  private isRunning = false;

  constructor(private readonly eventStore: IEventStore) {}

  registerProjection(name: string, projection: IProjection): void {
    this.projections.set(name, projection);
    this.logger.log(`Projection registered: ${name}`);
  }

  async startAll(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Projections already running');
      return;
    }

    this.isRunning = true;
    this.logger.log('Starting all projections...');

    // Subscribe to all events
    await this.eventStore.subscribeToAll(async (event) => {
      await this.projectEvent(event);
    });
  }

  async rebuildAll(): Promise<void> {
    this.logger.log('Rebuilding all projections...');

    // Clear all projections
    for (const [name, projection] of this.projections) {
      this.logger.log(`Clearing projection: ${name}`);
      await projection.clear();
    }

    // Read all events from beginning
    let position = 0;
    const batchSize = 1000;

    while (true) {
      const events = await this.eventStore.readAllEvents(position, batchSize);

      if (events.length === 0) {
        break;
      }

      // Project each event
      for (const event of events) {
        await this.projectEvent(event);
      }

      position += events.length;
      this.logger.log(`Processed ${position} events...`);
    }

    this.logger.log('All projections rebuilt successfully');
  }

  async rebuildProjection(name: string): Promise<void> {
    const projection = this.projections.get(name);

    if (!projection) {
      throw new Error(`Projection not found: ${name}`);
    }

    this.logger.log(`Rebuilding projection: ${name}`);

    await projection.clear();

    // Read all events and project
    let position = 0;
    const batchSize = 1000;

    while (true) {
      const events = await this.eventStore.readAllEvents(position, batchSize);

      if (events.length === 0) {
        break;
      }

      for (const event of events) {
        if (await projection.canHandle(event)) {
          await projection.handle(event);
        }
      }

      position += events.length;
    }

    this.logger.log(`Projection ${name} rebuilt successfully`);
  }

  private async projectEvent(event: DomainEvent): Promise<void> {
    for (const [name, projection] of this.projections) {
      try {
        if (await projection.canHandle(event)) {
          await projection.handle(event);
        }
      } catch (error) {
        this.logger.error(
          `Error projecting event ${event.eventType} in ${name}`,
          error,
        );
      }
    }
  }

  stop(): void {
    this.isRunning = false;
    this.logger.log('Projection manager stopped');
  }
}
```

### 5. Crear Projection para Order List
**Archivo**: `apps/order-service/src/application/projections/order-list.projection.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProjection } from '@a4co/event-sourcing';
import { DomainEvent } from '@a4co/event-sourcing';

// Read model entity
export class OrderReadModel {
  id: string;
  customerId: string;
  status: string;
  totalAmount: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class OrderListProjection implements IProjection {
  constructor(
    @InjectRepository(OrderReadModel)
    private readonly repository: Repository<OrderReadModel>,
  ) {}

  async canHandle(event: DomainEvent): Promise<boolean> {
    return event.aggregateType === 'Order';
  }

  async handle(event: DomainEvent): Promise<void> {
    switch (event.eventType) {
      case 'order.created.v1':
        await this.handleOrderCreated(event);
        break;

      case 'order.status.changed.v1':
        await this.handleOrderStatusChanged(event);
        break;

      case 'order.item.added.v1':
      case 'order.item.removed.v1':
        await this.handleOrderItemsChanged(event);
        break;
    }
  }

  async clear(): Promise<void> {
    await this.repository.clear();
  }

  private async handleOrderCreated(event: DomainEvent): Promise<void> {
    const data = event.data;

    const readModel = new OrderReadModel();
    readModel.id = data.orderId;
    readModel.customerId = data.customerId;
    readModel.status = 'PENDING';
    readModel.totalAmount = data.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.unitPrice,
      0,
    );
    readModel.itemCount = data.items.length;
    readModel.createdAt = event.timestamp;
    readModel.updatedAt = event.timestamp;

    await this.repository.save(readModel);
  }

  private async handleOrderStatusChanged(event: DomainEvent): Promise<void> {
    await this.repository.update(
      { id: event.aggregateId },
      {
        status: event.data.newStatus,
        updatedAt: event.timestamp,
      },
    );
  }

  private async handleOrderItemsChanged(event: DomainEvent): Promise<void> {
    // Recalculate total from events (or store items in read model)
    await this.repository.update(
      { id: event.aggregateId },
      {
        updatedAt: event.timestamp,
      },
    );
  }
}
```

### 6. Implementar Snapshot Strategy
**Archivo**: `packages/event-sourcing/src/snapshots/snapshot-manager.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';

export interface Snapshot {
  aggregateId: string;
  aggregateType: string;
  version: number;
  state: any;
  timestamp: Date;
}

export interface ISnapshotStore {
  save(snapshot: Snapshot): Promise<void>;
  load(aggregateId: string, aggregateType: string): Promise<Snapshot | null>;
  delete(aggregateId: string, aggregateType: string): Promise<void>;
}

@Injectable()
export class SnapshotManager {
  private readonly logger = new Logger(SnapshotManager.name);

  constructor(private readonly snapshotStore: ISnapshotStore) {}

  async saveSnapshot(
    aggregateId: string,
    aggregateType: string,
    version: number,
    state: any,
  ): Promise<void> {
    const snapshot: Snapshot = {
      aggregateId,
      aggregateType,
      version,
      state,
      timestamp: new Date(),
    };

    await this.snapshotStore.save(snapshot);
    this.logger.log(
      `Snapshot saved for ${aggregateType}-${aggregateId} at version ${version}`,
    );
  }

  async loadSnapshot(
    aggregateId: string,
    aggregateType: string,
  ): Promise<Snapshot | null> {
    return this.snapshotStore.load(aggregateId, aggregateType);
  }

  shouldTakeSnapshot(eventCount: number): boolean {
    // Take snapshot every 10 events
    return eventCount > 0 && eventCount % 10 === 0;
  }
}
```

### 7. Actualizar Order Module
**Archivo**: `apps/order-service/src/order.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventSourcingModule } from '@a4co/event-sourcing';
import { OrderController } from './presentation/controllers/controller';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { EventSourcedOrderRepository } from './infrastructure/repositories/event-sourced-order.repository';
import { OrderListProjection } from './application/projections/order-list.projection';
import { ProjectionManager } from '@a4co/event-sourcing';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventSourcingModule.forRoot({
      eventStoreType: 'eventstoredb',
      connectionString: process.env.EVENTSTORE_CONNECTION_STRING,
    }),
  ],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    {
      provide: 'OrderRepository',
      useClass: EventSourcedOrderRepository,
    },
    OrderListProjection,
  ],
})
export class OrderModule {
  constructor(
    private readonly projectionManager: ProjectionManager,
    private readonly orderListProjection: OrderListProjection,
  ) {
    // Register projections
    this.projectionManager.registerProjection(
      'order-list',
      this.orderListProjection,
    );

    // Start projections
    this.projectionManager.startAll();
  }
}
```

## CRITERIOS DE ACEPTACIÓN
- [ ] EventStoreDB integrado y corriendo
- [ ] Event Store adapter implementado
- [ ] Repository basado en Event Sourcing
- [ ] Eventos persistidos correctamente
- [ ] Aggregates reconstruidos desde eventos
- [ ] Projection Manager funcionando
- [ ] Al menos 1 proyección implementada (OrderList)
- [ ] Snapshot strategy para performance
- [ ] Tests de event replay
- [ ] Documentación de Event Sourcing

## VALIDACIÓN
```bash
# Arrancar EventStoreDB
docker run -d --name eventstoredb \
  -p 2113:2113 -p 1113:1113 \
  eventstore/eventstore:latest

# Verificar eventos persistidos
curl http://localhost:2113/streams/Order-{orderId}

# Rebuild projection
curl -X POST http://localhost:3004/projections/order-list/rebuild

# Verificar read model
curl http://localhost:3004/orders?page=1&limit=10
```

## BENEFICIOS
1. **Audit Trail Completo**: Histórico de todos los cambios
2. **Time Travel**: Consultar estado en cualquier momento
3. **Event Replay**: Reconstruir estado desde eventos
4. **Debugging**: Ver exactamente qué pasó
5. **Analytics**: Procesar eventos para reportes
6. **CQRS Completo**: Separación read/write optimizada

## REFERENCIAS
- EventStoreDB: https://www.eventstore.com/
- Event Sourcing Patterns: https://martinfowler.com/eaaDev/EventSourcing.html
- CQRS: https://martinfowler.com/bliki/CQRS.html

## ENTREGABLES
1. Package @a4co/event-sourcing completo
2. EventStoreDB adapter
3. Repository con Event Sourcing
4. Projection Manager + 1 proyección
5. Snapshot Manager
6. Tests de event replay
7. Documentación de arquitectura
8. Guía de operaciones (backup, restore, rebuild)
