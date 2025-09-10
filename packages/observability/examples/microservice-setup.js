"use strict";
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
const nats_1 = require("nats");
const ioredis_1 = __importDefault(require("ioredis"));
const observability_1 = require("@a4co/observability");
// 1. Inicializar observabilidad al inicio de la aplicación
async function bootstrap() {
    await (0, observability_1.initializeObservability)({
        serviceName: 'order-service',
        serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        logging: {
            level: process.env.LOG_LEVEL || 'info',
            prettyPrint: process.env.NODE_ENV === 'development',
            redact: ['password', 'creditCard', 'ssn', 'apiKey'],
        },
        tracing: {
            enabled: true,
            jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
            samplingRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        },
        metrics: {
            enabled: true,
            port: parseInt(process.env.METRICS_PORT || '9090'),
        },
    });
    const logger = (0, observability_1.getLogger)();
    logger.info('Order service starting...');
    // 2. Conectar servicios externos con instrumentación
    const nats = await connectNats();
    const redis = await connectRedis();
    // 3. Iniciar servidor Express
    const app = createExpressApp();
    // 4. Configurar handlers DDD
    setupDomainHandlers(nats);
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        logger.info({ port }, 'Order service started successfully');
    });
}
// Conectar NATS con instrumentación
async function connectNats() {
    const logger = (0, observability_1.getLogger)();
    try {
        const nc = await (0, nats_1.connect)({
            servers: process.env.NATS_URL || 'nats://localhost:4222',
            name: 'order-service',
        });
        logger.info('Connected to NATS');
        return (0, observability_1.instrumentNatsClient)(nc);
    }
    catch (error) {
        logger.error({ error }, 'Failed to connect to NATS');
        throw error;
    }
}
// Conectar Redis con instrumentación
async function connectRedis() {
    const logger = (0, observability_1.getLogger)();
    const redis = new ioredis_1.default({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    });
    redis.on('connect', () => {
        logger.info('Connected to Redis');
    });
    redis.on('error', error => {
        logger.error({ error }, 'Redis error');
    });
    return (0, observability_1.instrumentRedisClient)(redis);
}
// Crear aplicación Express con middleware de observabilidad
function createExpressApp() {
    const app = (0, express_1.default)();
    const logger = (0, observability_1.getLogger)();
    // Middleware de observabilidad
    app.use((0, observability_1.expressObservabilityMiddleware)({
        ignorePaths: ['/health', '/metrics', '/favicon.ico'],
        includeRequestBody: true,
        customAttributes: req => ({
            tenantId: req.headers['x-tenant-id'],
            clientVersion: req.headers['x-client-version'],
        }),
    }));
    app.use(express_1.default.json());
    // Health check
    app.get('/health', (req, res) => {
        res.json({ status: 'healthy', service: 'order-service' });
    });
    // Endpoint de creación de orden con observabilidad completa
    app.post('/api/orders', async (req, res) => {
        const correlationId = req.correlationId || (0, observability_1.generateCorrelationId)();
        const causationId = (0, observability_1.generateCausationId)(correlationId);
        // Logger con contexto de la petición
        const logger = req.log.withContext({
            correlationId,
            causationId,
            customerId: req.body.customerId,
        });
        logger.info('Creating new order');
        try {
            const order = await (0, observability_1.withSpan)('createOrder', async () => {
                // Validar orden
                const validation = await validateOrder(req.body);
                if (!validation.isValid) {
                    throw new ValidationError(validation.errors);
                }
                // Crear orden usando DDD
                const command = new CreateOrderCommand({
                    ...req.body,
                    correlationId,
                    causationId,
                });
                const handler = new CreateOrderCommandHandler();
                return await handler.handle(command);
            });
            logger.info({ orderId: order.id }, 'Order created successfully');
            res.status(201).json(order);
        }
        catch (error) {
            logger.error({ error }, 'Failed to create order');
            res.status(error.statusCode || 500).json({
                error: error.message,
                correlationId,
            });
        }
    });
    // Error handler
    app.use((0, observability_1.expressErrorHandler)());
    return app;
}
// Clases DDD con observabilidad integrada
class CreateOrderCommand {
    data;
    constructor(data) {
        this.data = data;
    }
}
class CreateOrderCommandHandler {
    logger = (0, observability_1.getLogger)().withContext({ handler: 'CreateOrderCommandHandler' });
    async handle(command) {
        const startTime = Date.now();
        this.logger.info({ command: command.data }, 'Handling CreateOrder command');
        try {
            // Crear span DDD
            const span = (0, observability_1.createDDDSpan)('CreateOrder', {
                aggregateName: 'Order',
                commandName: 'CreateOrder',
                correlationId: command.data.correlationId,
                causationId: command.data.causationId,
                userId: command.data.customerId,
            });
            try {
                // Lógica de negocio
                const order = await this.createOrder(command);
                // Publicar evento
                await this.publishOrderCreatedEvent(order);
                span.setStatus({ code: 0 });
                return order;
            }
            finally {
                span.end();
            }
        }
        catch (error) {
            this.logger.error({ error, command: command.data }, 'Failed to handle CreateOrder command');
            throw error;
        }
    }
    async createOrder(command) {
        // Simular creación de orden
        const order = {
            id: `order_${Date.now()}`,
            customerId: command.data.customerId,
            items: command.data.items,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        // Guardar en Redis
        const redis = await connectRedis();
        await redis.set(`order:${order.id}`, JSON.stringify(order), 'EX', 3600);
        return order;
    }
    async publishOrderCreatedEvent(order) {
        const logger = this.logger.withContext({ orderId: order.id });
        try {
            const nats = await connectNats();
            const event = {
                eventType: 'OrderCreated',
                aggregateId: order.id,
                data: order,
                timestamp: new Date().toISOString(),
            };
            await nats.publish('orders.created', JSON.stringify(event));
            // Registrar evento en métricas
            (0, observability_1.recordEvent)('OrderCreated', 'Order', 'published');
            logger.info('OrderCreated event published');
        }
        catch (error) {
            logger.error({ error }, 'Failed to publish OrderCreated event');
            throw error;
        }
    }
}
__decorate([
    (0, observability_1.CommandHandler)('CreateOrder', 'Order'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateOrderCommand]),
    __metadata("design:returntype", Promise)
], CreateOrderCommandHandler.prototype, "handle", null);
__decorate([
    (0, observability_1.Trace)({ recordResult: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateOrderCommand]),
    __metadata("design:returntype", Promise)
], CreateOrderCommandHandler.prototype, "createOrder", null);
// Configurar handlers de eventos
function setupDomainHandlers(nats) {
    const logger = (0, observability_1.getLogger)();
    // Handler para eventos de inventario
    nats.subscribe('inventory.updated', async (msg) => {
        const handler = new InventoryUpdatedEventHandler();
        await handler.handle(msg);
    });
    logger.info('Domain event handlers configured');
}
class InventoryUpdatedEventHandler {
    logger = (0, observability_1.getLogger)().withContext({ handler: 'InventoryUpdatedEventHandler' });
    async handle(msg) {
        try {
            const event = JSON.parse(msg.data);
            this.logger.info({ event }, 'Processing InventoryUpdated event');
            // Lógica de procesamiento
            await this.updateOrderStatus(event);
            // Registrar procesamiento exitoso
            (0, observability_1.recordEvent)('InventoryUpdated', 'Inventory', 'processed');
        }
        catch (error) {
            this.logger.error({ error }, 'Failed to process InventoryUpdated event');
            throw error;
        }
    }
    async updateOrderStatus(event) {
        // Lógica para actualizar estado de orden basado en inventario
        this.logger.debug({ event }, 'Updating order status based on inventory');
    }
}
__decorate([
    (0, observability_1.EventHandler)('InventoryUpdated', 'Inventory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryUpdatedEventHandler.prototype, "handle", null);
__decorate([
    (0, observability_1.Trace)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryUpdatedEventHandler.prototype, "updateOrderStatus", null);
// Funciones auxiliares
async function validateOrder(orderData) {
    return (0, observability_1.withSpan)('validateOrder', async () => {
        const errors = [];
        if (!orderData.customerId) {
            errors.push('Customer ID is required');
        }
        if (!orderData.items || orderData.items.length === 0) {
            errors.push('Order must contain at least one item');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    });
}
class ValidationError extends Error {
    errors;
    statusCode = 400;
    constructor(errors) {
        super('Validation failed');
        this.errors = errors;
    }
}
// Iniciar aplicación
bootstrap().catch(error => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
//# sourceMappingURL=microservice-setup.js.map