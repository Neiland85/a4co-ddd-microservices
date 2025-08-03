"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var nats_1 = require("nats");
var ioredis_1 = require("ioredis");
var observability_1 = require("@a4co/observability");
// 1. Inicializar observabilidad al inicio de la aplicación
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, nats, redis, app, port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, observability_1.initializeObservability)({
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
                    })];
                case 1:
                    _a.sent();
                    logger = (0, observability_1.getLogger)();
                    logger.info('Order service starting...');
                    return [4 /*yield*/, connectNats()];
                case 2:
                    nats = _a.sent();
                    return [4 /*yield*/, connectRedis()];
                case 3:
                    redis = _a.sent();
                    app = createExpressApp();
                    // 4. Configurar handlers DDD
                    setupDomainHandlers(nats);
                    port = process.env.PORT || 3000;
                    app.listen(port, function () {
                        logger.info({ port: port }, 'Order service started successfully');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// Conectar NATS con instrumentación
function connectNats() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, nc, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = (0, observability_1.getLogger)();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, nats_1.connect)({
                            servers: process.env.NATS_URL || 'nats://localhost:4222',
                            name: 'order-service',
                        })];
                case 2:
                    nc = _a.sent();
                    logger.info('Connected to NATS');
                    return [2 /*return*/, (0, observability_1.instrumentNatsClient)(nc)];
                case 3:
                    error_1 = _a.sent();
                    logger.error({ error: error_1 }, 'Failed to connect to NATS');
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Conectar Redis con instrumentación
function connectRedis() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, redis;
        return __generator(this, function (_a) {
            logger = (0, observability_1.getLogger)();
            redis = new ioredis_1.default({
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            });
            redis.on('connect', function () {
                logger.info('Connected to Redis');
            });
            redis.on('error', function (error) {
                logger.error({ error: error }, 'Redis error');
            });
            return [2 /*return*/, (0, observability_1.instrumentRedisClient)(redis)];
        });
    });
}
// Crear aplicación Express con middleware de observabilidad
function createExpressApp() {
    var _this = this;
    var app = (0, express_1.default)();
    var logger = (0, observability_1.getLogger)();
    // Middleware de observabilidad
    app.use((0, observability_1.expressObservabilityMiddleware)({
        ignorePaths: ['/health', '/metrics', '/favicon.ico'],
        includeRequestBody: true,
        customAttributes: function (req) { return ({
            tenantId: req.headers['x-tenant-id'],
            clientVersion: req.headers['x-client-version'],
        }); },
    }));
    app.use(express_1.default.json());
    // Health check
    app.get('/health', function (req, res) {
        res.json({ status: 'healthy', service: 'order-service' });
    });
    // Endpoint de creación de orden con observabilidad completa
    app.post('/api/orders', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var correlationId, causationId, logger, order, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    correlationId = req.correlationId || (0, observability_1.generateCorrelationId)();
                    causationId = (0, observability_1.generateCausationId)(correlationId);
                    logger = req.log.withContext({
                        correlationId: correlationId,
                        causationId: causationId,
                        customerId: req.body.customerId,
                    });
                    logger.info('Creating new order');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, observability_1.withSpan)('createOrder', function () { return __awaiter(_this, void 0, void 0, function () {
                            var validation, command, handler;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, validateOrder(req.body)];
                                    case 1:
                                        validation = _a.sent();
                                        if (!validation.isValid) {
                                            throw new ValidationError(validation.errors);
                                        }
                                        command = new CreateOrderCommand(__assign(__assign({}, req.body), { correlationId: correlationId, causationId: causationId }));
                                        handler = new CreateOrderCommandHandler();
                                        return [4 /*yield*/, handler.handle(command)];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 2:
                    order = _a.sent();
                    logger.info({ orderId: order.id }, 'Order created successfully');
                    res.status(201).json(order);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    logger.error({ error: error_2 }, 'Failed to create order');
                    res.status(error_2.statusCode || 500).json({
                        error: error_2.message,
                        correlationId: correlationId,
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // Error handler
    app.use((0, observability_1.expressErrorHandler)());
    return app;
}
// Clases DDD con observabilidad integrada
var CreateOrderCommand = /** @class */ (function () {
    function CreateOrderCommand(data) {
        this.data = data;
    }
    return CreateOrderCommand;
}());
var CreateOrderCommandHandler = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _handle_decorators;
    var _createOrder_decorators;
    return _a = /** @class */ (function () {
            function CreateOrderCommandHandler() {
                this.logger = (__runInitializers(this, _instanceExtraInitializers), (0, observability_1.getLogger)().withContext({ handler: 'CreateOrderCommandHandler' }));
            }
            CreateOrderCommandHandler.prototype.handle = function (command) {
                return __awaiter(this, void 0, void 0, function () {
                    var startTime, span, order, error_3;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                startTime = Date.now();
                                this.logger.info({ command: command.data }, 'Handling CreateOrder command');
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 7, , 8]);
                                span = (0, observability_1.createDDDSpan)('CreateOrder', {
                                    aggregateName: 'Order',
                                    commandName: 'CreateOrder',
                                    correlationId: command.data.correlationId,
                                    causationId: command.data.causationId,
                                    userId: command.data.customerId,
                                });
                                _b.label = 2;
                            case 2:
                                _b.trys.push([2, , 5, 6]);
                                return [4 /*yield*/, this.createOrder(command)];
                            case 3:
                                order = _b.sent();
                                // Publicar evento
                                return [4 /*yield*/, this.publishOrderCreatedEvent(order)];
                            case 4:
                                // Publicar evento
                                _b.sent();
                                span.setStatus({ code: 0 });
                                return [2 /*return*/, order];
                            case 5:
                                span.end();
                                return [7 /*endfinally*/];
                            case 6: return [3 /*break*/, 8];
                            case 7:
                                error_3 = _b.sent();
                                this.logger.error({ error: error_3, command: command.data }, 'Failed to handle CreateOrder command');
                                throw error_3;
                            case 8: return [2 /*return*/];
                        }
                    });
                });
            };
            CreateOrderCommandHandler.prototype.createOrder = function (command) {
                return __awaiter(this, void 0, void 0, function () {
                    var order, redis;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                order = {
                                    id: "order_".concat(Date.now()),
                                    customerId: command.data.customerId,
                                    items: command.data.items,
                                    status: 'pending',
                                    createdAt: new Date().toISOString(),
                                };
                                return [4 /*yield*/, connectRedis()];
                            case 1:
                                redis = _b.sent();
                                return [4 /*yield*/, redis.set("order:".concat(order.id), JSON.stringify(order), 'EX', 3600)];
                            case 2:
                                _b.sent();
                                return [2 /*return*/, order];
                        }
                    });
                });
            };
            CreateOrderCommandHandler.prototype.publishOrderCreatedEvent = function (order) {
                return __awaiter(this, void 0, void 0, function () {
                    var logger, nats, event_1, error_4;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                logger = this.logger.withContext({ orderId: order.id });
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, connectNats()];
                            case 2:
                                nats = _b.sent();
                                event_1 = {
                                    eventType: 'OrderCreated',
                                    aggregateId: order.id,
                                    data: order,
                                    timestamp: new Date().toISOString(),
                                };
                                return [4 /*yield*/, nats.publish('orders.created', JSON.stringify(event_1))];
                            case 3:
                                _b.sent();
                                // Registrar evento en métricas
                                (0, observability_1.recordEvent)('OrderCreated', 'Order', 'published');
                                logger.info('OrderCreated event published');
                                return [3 /*break*/, 5];
                            case 4:
                                error_4 = _b.sent();
                                logger.error({ error: error_4 }, 'Failed to publish OrderCreated event');
                                throw error_4;
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            };
            return CreateOrderCommandHandler;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _handle_decorators = [(0, observability_1.CommandHandler)('CreateOrder', 'Order')];
            _createOrder_decorators = [(0, observability_1.Trace)({ recordResult: true })];
            __esDecorate(_a, null, _handle_decorators, { kind: "method", name: "handle", static: false, private: false, access: { has: function (obj) { return "handle" in obj; }, get: function (obj) { return obj.handle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createOrder_decorators, { kind: "method", name: "createOrder", static: false, private: false, access: { has: function (obj) { return "createOrder" in obj; }, get: function (obj) { return obj.createOrder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
// Configurar handlers de eventos
function setupDomainHandlers(nats) {
    var _this = this;
    var logger = (0, observability_1.getLogger)();
    // Handler para eventos de inventario
    nats.subscribe('inventory.updated', function (msg) { return __awaiter(_this, void 0, void 0, function () {
        var handler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handler = new InventoryUpdatedEventHandler();
                    return [4 /*yield*/, handler.handle(msg)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    logger.info('Domain event handlers configured');
}
var InventoryUpdatedEventHandler = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _handle_decorators;
    var _updateOrderStatus_decorators;
    return _a = /** @class */ (function () {
            function InventoryUpdatedEventHandler() {
                this.logger = (__runInitializers(this, _instanceExtraInitializers), (0, observability_1.getLogger)().withContext({ handler: 'InventoryUpdatedEventHandler' }));
            }
            InventoryUpdatedEventHandler.prototype.handle = function (msg) {
                return __awaiter(this, void 0, void 0, function () {
                    var event_2, error_5;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                event_2 = JSON.parse(msg.data);
                                this.logger.info({ event: event_2 }, 'Processing InventoryUpdated event');
                                // Lógica de procesamiento
                                return [4 /*yield*/, this.updateOrderStatus(event_2)];
                            case 1:
                                // Lógica de procesamiento
                                _b.sent();
                                // Registrar procesamiento exitoso
                                (0, observability_1.recordEvent)('InventoryUpdated', 'Inventory', 'processed');
                                return [3 /*break*/, 3];
                            case 2:
                                error_5 = _b.sent();
                                this.logger.error({ error: error_5 }, 'Failed to process InventoryUpdated event');
                                throw error_5;
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            };
            InventoryUpdatedEventHandler.prototype.updateOrderStatus = function (event) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        // Lógica para actualizar estado de orden basado en inventario
                        this.logger.debug({ event: event }, 'Updating order status based on inventory');
                        return [2 /*return*/];
                    });
                });
            };
            return InventoryUpdatedEventHandler;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _handle_decorators = [(0, observability_1.EventHandler)('InventoryUpdated', 'Inventory')];
            _updateOrderStatus_decorators = [(0, observability_1.Trace)()];
            __esDecorate(_a, null, _handle_decorators, { kind: "method", name: "handle", static: false, private: false, access: { has: function (obj) { return "handle" in obj; }, get: function (obj) { return obj.handle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateOrderStatus_decorators, { kind: "method", name: "updateOrderStatus", static: false, private: false, access: { has: function (obj) { return "updateOrderStatus" in obj; }, get: function (obj) { return obj.updateOrderStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
// Funciones auxiliares
function validateOrder(orderData) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, observability_1.withSpan)('validateOrder', function () { return __awaiter(_this, void 0, void 0, function () {
                    var errors;
                    return __generator(this, function (_a) {
                        errors = [];
                        if (!orderData.customerId) {
                            errors.push('Customer ID is required');
                        }
                        if (!orderData.items || orderData.items.length === 0) {
                            errors.push('Order must contain at least one item');
                        }
                        return [2 /*return*/, {
                                isValid: errors.length === 0,
                                errors: errors,
                            }];
                    });
                }); })];
        });
    });
}
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(errors) {
        var _this = _super.call(this, 'Validation failed') || this;
        _this.errors = errors;
        _this.statusCode = 400;
        return _this;
    }
    return ValidationError;
}(Error));
// Iniciar aplicación
bootstrap().catch(function (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
});
