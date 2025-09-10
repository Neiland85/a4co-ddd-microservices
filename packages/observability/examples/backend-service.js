"use strict";
/**
 * Example: Backend microservice with full observability
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const observability_1 = require("@a4co/observability");
// Initialize observability
const logger = (0, observability_1.createLogger)({
    service: 'order-service',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.SERVICE_VERSION || '1.0.0',
    level: process.env.LOG_LEVEL || 'info',
    pretty: process.env.NODE_ENV === 'development',
});
const tracer = (0, observability_1.initializeTracer)({
    serviceName: 'order-service',
    serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    jaegerEndpoint: process.env.JAEGER_ENDPOINT,
    prometheusPort: 9090,
    logger,
});
// Initialize NATS client with tracing
const natsClient = new observability_1.TracedNatsClient({
    serviceName: 'order-service',
    logger,
});
// Domain service with observability
class OrderService {
    logger;
    constructor(logger = logger.child({ component: 'OrderService' })) {
        this.logger = logger;
    }
    async createOrder(command) {
        // Log command reception
        this.logger.info('Processing create order command', {
            ddd: {
                aggregateId: command.orderId,
                aggregateType: 'Order',
                commandName: 'CreateOrderCommand',
                userId: command.userId,
                correlationId: command.correlationId,
            },
        });
        try {
            // Validate order
            await (0, observability_1.withSpan)('validate-order', async (span) => {
                span.setAttribute('order.items', command.items.length);
                span.setAttribute('order.total', command.total);
                if (command.total <= 0) {
                    throw new Error('Invalid order total');
                }
            });
            // Create order aggregate
            const order = await (0, observability_1.withSpan)('create-order-aggregate', async (span) => {
                const order = new Order({
                    id: command.orderId,
                    userId: command.userId,
                    items: command.items,
                    total: command.total,
                    status: 'pending',
                });
                span.setAttribute('order.id', order.id);
                return order;
            });
            // Save to database
            await (0, observability_1.withSpan)('save-order-to-db', async (span) => {
                span.setAttribute('db.operation', 'insert');
                span.setAttribute('db.table', 'orders');
                // Simulated DB operation
                await new Promise(resolve => setTimeout(resolve, 50));
            });
            // Publish domain event
            await natsClient.publishEvent('orders.created', {
                type: 'OrderCreated',
                aggregateId: order.id,
                data: {
                    orderId: order.id,
                    userId: order.userId,
                    items: order.items,
                    total: order.total,
                    createdAt: new Date().toISOString(),
                },
                metadata: {
                    correlationId: command.correlationId,
                    causationId: command.id,
                },
            });
            this.logger.info('Order created successfully', {
                ddd: {
                    aggregateId: order.id,
                    aggregateType: 'Order',
                    eventName: 'OrderCreated',
                    eventVersion: 1,
                },
            });
            return order;
        }
        catch (error) {
            this.logger.error('Failed to create order', error, {
                ddd: {
                    aggregateId: command.orderId,
                    commandName: 'CreateOrderCommand',
                },
            });
            throw error;
        }
    }
}
__decorate([
    (0, observability_1.Trace)({ name: 'OrderService.createOrder' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderService.prototype, "createOrder", null);
// Express application
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Add observability middleware
app.use((0, observability_1.expressTracingMiddleware)({
    serviceName: 'order-service',
    logger,
    captureRequestBody: true,
}));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'order-service',
        version: process.env.SERVICE_VERSION || '1.0.0',
    });
});
// Metrics endpoint
app.get('/metrics', async (req, res) => {
    // Prometheus metrics will be exposed here
    res.set('Content-Type', 'text/plain');
    res.send('# Prometheus metrics');
});
// Order creation endpoint
const orderService = new OrderService();
app.post('/orders', async (req, res) => {
    const tracingContext = (0, observability_1.getTracingContext)();
    try {
        const command = {
            id: generateId(),
            orderId: generateId(),
            userId: req.body.userId,
            items: req.body.items,
            total: req.body.total,
            correlationId: tracingContext?.traceId || generateId(),
        };
        const order = await orderService.createOrder(command);
        res.status(201).json({
            success: true,
            data: order,
            traceId: tracingContext?.traceId,
        });
    }
    catch (error) {
        const err = error;
        res.status(400).json({
            success: false,
            error: err.message,
            traceId: tracingContext?.traceId,
        });
    }
});
// Event subscriptions
natsClient.subscribeToEvents('inventory.reserved', async (event, span) => {
    logger.info('Received inventory reserved event', {
        ddd: {
            eventName: 'InventoryReserved',
            aggregateId: event.aggregateId,
        },
    });
    span.setAttribute('order.id', event.data.orderId);
    // Process the event...
});
// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('Shutting down service...');
    // Close connections
    await new Promise(resolve => setTimeout(resolve, 1000));
    logger.info('Service shut down complete');
    process.exit(0);
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Order service started on port ${PORT}`, {
        custom: {
            port: PORT,
            environment: process.env.NODE_ENV,
            pid: process.pid,
        },
    });
});
class Order {
    constructor(data) {
        Object.assign(this, data);
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
//# sourceMappingURL=backend-service.js.map