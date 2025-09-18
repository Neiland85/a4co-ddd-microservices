"use strict";
/**
 * Example: Backend microservice with full observability
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var observability_1 = require("@a4co/observability");
// Initialize observability
var logger = (0, observability_1.createLogger)({
    service: 'order-service',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.SERVICE_VERSION || '1.0.0',
    level: process.env.LOG_LEVEL || 'info',
    pretty: process.env.NODE_ENV === 'development',
});
var tracer = (0, observability_1.initializeTracer)({
    serviceName: 'order-service',
    serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    jaegerEndpoint: process.env.JAEGER_ENDPOINT,
    prometheusPort: 9090,
    logger: logger,
});
// Initialize NATS client with tracing
var natsClient = new observability_1.TracedNatsClient({
    serviceName: 'order-service',
    logger: logger,
});
// Domain service with observability
var OrderService = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _createOrder_decorators;
    return _a = /** @class */ (function () {
            function OrderService(logger) {
                if (logger === void 0) { logger = logger.child({ component: 'OrderService' }); }
                this.logger = (__runInitializers(this, _instanceExtraInitializers), logger);
            }
            OrderService.prototype.createOrder = function (command) {
                return __awaiter(this, void 0, void 0, function () {
                    var order, error_1;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
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
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 6, , 7]);
                                // Validate order
                                return [4 /*yield*/, (0, observability_1.withSpan)('validate-order', function (span) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_b) {
                                            span.setAttribute('order.items', command.items.length);
                                            span.setAttribute('order.total', command.total);
                                            if (command.total <= 0) {
                                                throw new Error('Invalid order total');
                                            }
                                            return [2 /*return*/];
                                        });
                                    }); })];
                            case 2:
                                // Validate order
                                _b.sent();
                                return [4 /*yield*/, (0, observability_1.withSpan)('create-order-aggregate', function (span) { return __awaiter(_this, void 0, void 0, function () {
                                        var order;
                                        return __generator(this, function (_b) {
                                            order = new Order({
                                                id: command.orderId,
                                                userId: command.userId,
                                                items: command.items,
                                                total: command.total,
                                                status: 'pending',
                                            });
                                            span.setAttribute('order.id', order.id);
                                            return [2 /*return*/, order];
                                        });
                                    }); })];
                            case 3:
                                order = _b.sent();
                                // Save to database
                                return [4 /*yield*/, (0, observability_1.withSpan)('save-order-to-db', function (span) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    span.setAttribute('db.operation', 'insert');
                                                    span.setAttribute('db.table', 'orders');
                                                    // Simulated DB operation
                                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 50); })];
                                                case 1:
                                                    // Simulated DB operation
                                                    _b.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                            case 4:
                                // Save to database
                                _b.sent();
                                // Publish domain event
                                return [4 /*yield*/, natsClient.publishEvent('orders.created', {
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
                                    })];
                            case 5:
                                // Publish domain event
                                _b.sent();
                                this.logger.info('Order created successfully', {
                                    ddd: {
                                        aggregateId: order.id,
                                        aggregateType: 'Order',
                                        eventName: 'OrderCreated',
                                        eventVersion: 1,
                                    },
                                });
                                return [2 /*return*/, order];
                            case 6:
                                error_1 = _b.sent();
                                this.logger.error('Failed to create order', error_1, {
                                    ddd: {
                                        aggregateId: command.orderId,
                                        commandName: 'CreateOrderCommand',
                                    },
                                });
                                throw error_1;
                            case 7: return [2 /*return*/];
                        }
                    });
                });
            };
            return OrderService;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _createOrder_decorators = [(0, observability_1.Trace)({ name: 'OrderService.createOrder' })];
            __esDecorate(_a, null, _createOrder_decorators, { kind: "method", name: "createOrder", static: false, private: false, access: { has: function (obj) { return "createOrder" in obj; }, get: function (obj) { return obj.createOrder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
// Express application
var app = (0, express_1.default)();
app.use(express_1.default.json());
// Add observability middleware
app.use((0, observability_1.expressTracingMiddleware)({
    serviceName: 'order-service',
    logger: logger,
    captureRequestBody: true,
}));
// Health check endpoint
app.get('/health', function (req, res) {
    res.json({
        status: 'healthy',
        service: 'order-service',
        version: process.env.SERVICE_VERSION || '1.0.0',
    });
});
// Metrics endpoint
app.get('/metrics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Prometheus metrics will be exposed here
        res.set('Content-Type', 'text/plain');
        res.send('# Prometheus metrics');
        return [2 /*return*/];
    });
}); });
// Order creation endpoint
var orderService = new OrderService();
app.post('/orders', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tracingContext, command, order, error_2, err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tracingContext = (0, observability_1.getTracingContext)();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                command = {
                    id: generateId(),
                    orderId: generateId(),
                    userId: req.body.userId,
                    items: req.body.items,
                    total: req.body.total,
                    correlationId: (tracingContext === null || tracingContext === void 0 ? void 0 : tracingContext.traceId) || generateId(),
                };
                return [4 /*yield*/, orderService.createOrder(command)];
            case 2:
                order = _a.sent();
                res.status(201).json({
                    success: true,
                    data: order,
                    traceId: tracingContext === null || tracingContext === void 0 ? void 0 : tracingContext.traceId,
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                err = error_2;
                res.status(400).json({
                    success: false,
                    error: err.message,
                    traceId: tracingContext === null || tracingContext === void 0 ? void 0 : tracingContext.traceId,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Event subscriptions
natsClient.subscribeToEvents('inventory.reserved', function (event, span) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        logger.info('Received inventory reserved event', {
            ddd: {
                eventName: 'InventoryReserved',
                aggregateId: event.aggregateId,
            },
        });
        span.setAttribute('order.id', event.data.orderId);
        return [2 /*return*/];
    });
}); });
// Graceful shutdown
process.on('SIGTERM', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger.info('Shutting down service...');
                // Close connections
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
            case 1:
                // Close connections
                _a.sent();
                logger.info('Service shut down complete');
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
// Start server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    logger.info("Order service started on port ".concat(PORT), {
        custom: {
            port: PORT,
            environment: process.env.NODE_ENV,
            pid: process.pid,
        },
    });
});
var Order = /** @class */ (function () {
    function Order(data) {
        Object.assign(this, data);
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    return Order;
}());
function generateId() {
    return "".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
}
