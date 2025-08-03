"use strict";
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
exports.ProductEventHandler = exports.ProductCommandHandler = exports.Product = exports.app = void 0;
var express_1 = require("express");
var src_1 = require("../src");
var ddd_tracing_1 = require("../src/ddd-tracing");
var src_2 = require("../src");
// Configuración de observabilidad
var observability = (0, src_1.initializeObservability)({
    serviceName: 'product-service',
    serviceVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    logging: {
        level: 'info',
        prettyPrint: process.env.NODE_ENV === 'development',
    },
    tracing: {
        enabled: true,
        jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
        enableConsoleExporter: process.env.NODE_ENV === 'development',
        enableAutoInstrumentation: true,
    },
    metrics: {
        enabled: true,
        port: 9464,
        endpoint: '/metrics',
    },
});
// Agregado de Producto (DDD)
var Product = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _updateStock_decorators;
    var _updatePrice_decorators;
    return _a = /** @class */ (function () {
            function Product(id, name, price, stock) {
                this.id = (__runInitializers(this, _instanceExtraInitializers), id);
                this.name = name;
                this.price = price;
                this.stock = stock;
            }
            Product.prototype.updateStock = function (quantity) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        src_2.logger.info('Updating product stock', {
                            productId: this.id,
                            currentStock: this.stock,
                            newQuantity: quantity,
                        });
                        if (this.stock + quantity < 0) {
                            throw new Error('Insufficient stock');
                        }
                        this.stock += quantity;
                        src_2.logger.info('Product stock updated', {
                            productId: this.id,
                            newStock: this.stock,
                        });
                        return [2 /*return*/];
                    });
                });
            };
            Product.prototype.updatePrice = function (newPrice) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        src_2.logger.info('Updating product price', {
                            productId: this.id,
                            currentPrice: this.price,
                            newPrice: newPrice,
                        });
                        if (newPrice < 0) {
                            throw new Error('Price cannot be negative');
                        }
                        this.price = newPrice;
                        src_2.logger.info('Product price updated', {
                            productId: this.id,
                            newPrice: this.price,
                        });
                        return [2 /*return*/];
                    });
                });
            };
            return Product;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _updateStock_decorators = [(0, ddd_tracing_1.TraceAggregateMethod)('Product')];
            _updatePrice_decorators = [(0, ddd_tracing_1.TraceAggregateMethod)('Product')];
            __esDecorate(_a, null, _updateStock_decorators, { kind: "method", name: "updateStock", static: false, private: false, access: { has: function (obj) { return "updateStock" in obj; }, get: function (obj) { return obj.updateStock; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updatePrice_decorators, { kind: "method", name: "updatePrice", static: false, private: false, access: { has: function (obj) { return "updatePrice" in obj; }, get: function (obj) { return obj.updatePrice; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.Product = Product;
// Command Handler
var ProductCommandHandler = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _handleCreateProduct_decorators;
    var _handleUpdateStock_decorators;
    return _a = /** @class */ (function () {
            function ProductCommandHandler() {
                this.products = (__runInitializers(this, _instanceExtraInitializers), new Map());
            }
            ProductCommandHandler.prototype.handleCreateProduct = function (command) {
                return __awaiter(this, void 0, void 0, function () {
                    var product, event;
                    return __generator(this, function (_b) {
                        src_2.logger.info('Handling CreateProduct command', {
                            commandId: command.commandId,
                            correlationId: command.correlationId,
                            userId: command.userId,
                        });
                        product = new Product(command.commandId, // Usar commandId como productId para simplicidad
                        command.name, command.price, command.initialStock);
                        this.products.set(product.id, product);
                        event = {
                            eventId: "evt_".concat(Date.now()),
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            initialStock: product.stock,
                            correlationId: command.correlationId,
                            causationId: command.commandId,
                        };
                        src_2.logger.info('Product created', {
                            productId: product.id,
                            eventId: event.eventId,
                        });
                        return [2 /*return*/, event];
                    });
                });
            };
            ProductCommandHandler.prototype.handleUpdateStock = function (command) {
                return __awaiter(this, void 0, void 0, function () {
                    var product, oldStock, event;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                src_2.logger.info('Handling UpdateStock command', {
                                    commandId: command.commandId,
                                    productId: command.productId,
                                    correlationId: command.correlationId,
                                });
                                product = this.products.get(command.productId);
                                if (!product) {
                                    throw new Error("Product not found: ".concat(command.productId));
                                }
                                oldStock = product.stock;
                                return [4 /*yield*/, product.updateStock(command.quantity)];
                            case 1:
                                _b.sent();
                                event = {
                                    eventId: "evt_".concat(Date.now()),
                                    productId: product.id,
                                    oldStock: oldStock,
                                    newStock: product.stock,
                                    quantity: command.quantity,
                                    correlationId: command.correlationId,
                                    causationId: command.commandId,
                                };
                                src_2.logger.info('Stock updated', {
                                    productId: product.id,
                                    eventId: event.eventId,
                                    oldStock: oldStock,
                                    newStock: product.stock,
                                });
                                return [2 /*return*/, event];
                        }
                    });
                });
            };
            return ProductCommandHandler;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _handleCreateProduct_decorators = [(0, ddd_tracing_1.TraceCommand)('CreateProduct')];
            _handleUpdateStock_decorators = [(0, ddd_tracing_1.TraceCommand)('UpdateStock')];
            __esDecorate(_a, null, _handleCreateProduct_decorators, { kind: "method", name: "handleCreateProduct", static: false, private: false, access: { has: function (obj) { return "handleCreateProduct" in obj; }, get: function (obj) { return obj.handleCreateProduct; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _handleUpdateStock_decorators, { kind: "method", name: "handleUpdateStock", static: false, private: false, access: { has: function (obj) { return "handleUpdateStock" in obj; }, get: function (obj) { return obj.handleUpdateStock; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ProductCommandHandler = ProductCommandHandler;
// Event Handler
var ProductEventHandler = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _handleProductCreated_decorators;
    var _handleStockUpdated_decorators;
    return _a = /** @class */ (function () {
            function ProductEventHandler() {
                __runInitializers(this, _instanceExtraInitializers);
            }
            ProductEventHandler.prototype.handleProductCreated = function (event) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                src_2.logger.info('Handling ProductCreated event', {
                                    eventId: event.eventId,
                                    productId: event.productId,
                                    correlationId: event.correlationId,
                                });
                                // Simular procesamiento del evento
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                            case 1:
                                // Simular procesamiento del evento
                                _b.sent();
                                src_2.logger.info('ProductCreated event processed', {
                                    eventId: event.eventId,
                                    productId: event.productId,
                                });
                                return [2 /*return*/];
                        }
                    });
                });
            };
            ProductEventHandler.prototype.handleStockUpdated = function (event) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                src_2.logger.info('Handling StockUpdated event', {
                                    eventId: event.eventId,
                                    productId: event.productId,
                                    correlationId: event.correlationId,
                                });
                                // Simular procesamiento del evento
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 50); })];
                            case 1:
                                // Simular procesamiento del evento
                                _b.sent();
                                src_2.logger.info('StockUpdated event processed', {
                                    eventId: event.eventId,
                                    productId: event.productId,
                                });
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return ProductEventHandler;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _handleProductCreated_decorators = [(0, ddd_tracing_1.TraceEventHandler)('ProductCreated')];
            _handleStockUpdated_decorators = [(0, ddd_tracing_1.TraceEventHandler)('StockUpdated')];
            __esDecorate(_a, null, _handleProductCreated_decorators, { kind: "method", name: "handleProductCreated", static: false, private: false, access: { has: function (obj) { return "handleProductCreated" in obj; }, get: function (obj) { return obj.handleProductCreated; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _handleStockUpdated_decorators, { kind: "method", name: "handleStockUpdated", static: false, private: false, access: { has: function (obj) { return "handleStockUpdated" in obj; }, get: function (obj) { return obj.handleStockUpdated; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ProductEventHandler = ProductEventHandler;
// Controlador REST
var ProductController = /** @class */ (function () {
    function ProductController() {
        this.commandHandler = new ProductCommandHandler();
        this.eventHandler = new ProductEventHandler();
    }
    ProductController.prototype.createProduct = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var correlationId, userId, command, event_1, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        correlationId = req.headers['x-correlation-id'] || "req_".concat(Date.now());
                        userId = req.headers['x-user-id'] || 'anonymous';
                        command = {
                            commandId: "cmd_".concat(Date.now()),
                            name: req.body.name,
                            price: req.body.price,
                            initialStock: req.body.initialStock || 0,
                            userId: userId,
                            correlationId: correlationId,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, ddd_tracing_1.traceDomainTransaction)('createProduct', command, function () { return _this.commandHandler.handleCreateProduct(command); })];
                    case 2:
                        event_1 = _a.sent();
                        // Procesar el evento
                        return [4 /*yield*/, this.eventHandler.handleProductCreated(event_1)];
                    case 3:
                        // Procesar el evento
                        _a.sent();
                        res.status(201).json({
                            productId: event_1.productId,
                            message: 'Product created successfully',
                            correlationId: correlationId,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        src_2.logger.error('Error creating product', error_1, {
                            commandId: command.commandId,
                            correlationId: correlationId,
                        });
                        res.status(500).json({
                            error: 'Failed to create product',
                            correlationId: correlationId,
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.updateStock = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var correlationId, userId, productId, command, event_2, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        correlationId = req.headers['x-correlation-id'] || "req_".concat(Date.now());
                        userId = req.headers['x-user-id'] || 'anonymous';
                        productId = req.params.id;
                        command = {
                            commandId: "cmd_".concat(Date.now()),
                            productId: productId,
                            quantity: req.body.quantity,
                            userId: userId,
                            correlationId: correlationId,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, ddd_tracing_1.traceDomainTransaction)('updateStock', command, function () { return _this.commandHandler.handleUpdateStock(command); })];
                    case 2:
                        event_2 = _a.sent();
                        // Procesar el evento
                        return [4 /*yield*/, this.eventHandler.handleStockUpdated(event_2)];
                    case 3:
                        // Procesar el evento
                        _a.sent();
                        res.json({
                            productId: event_2.productId,
                            newStock: event_2.newStock,
                            message: 'Stock updated successfully',
                            correlationId: correlationId,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        src_2.logger.error('Error updating stock', error_2, {
                            commandId: command.commandId,
                            productId: productId,
                            correlationId: correlationId,
                        });
                        res.status(500).json({
                            error: 'Failed to update stock',
                            correlationId: correlationId,
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProductController.prototype.getProduct = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var correlationId, productId, span, product, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        correlationId = req.headers['x-correlation-id'] || "req_".concat(Date.now());
                        productId = req.params.id;
                        span = (0, ddd_tracing_1.createDomainSpan)('getProduct', {
                            aggregateName: 'Product',
                            aggregateId: productId,
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        // Simular búsqueda de producto
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 50); })];
                    case 2:
                        // Simular búsqueda de producto
                        _a.sent();
                        product = {
                            id: productId,
                            name: 'Sample Product',
                            price: 99.99,
                            stock: 100,
                        };
                        span.setStatus({ code: 1 }); // OK
                        res.json({
                            product: product,
                            correlationId: correlationId,
                        });
                        return [3 /*break*/, 5];
                    case 3:
                        error_3 = _a.sent();
                        span.setStatus({
                            code: 2, // ERROR
                            message: error_3 instanceof Error ? error_3.message : String(error_3),
                        });
                        span.recordException(error_3);
                        res.status(500).json({
                            error: 'Failed to get product',
                            correlationId: correlationId,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        span.end();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ProductController;
}());
// Configurar Express
var app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
// Middleware de observabilidad
app.use((0, ddd_tracing_1.dddContextMiddleware)());
app.use(observability.httpLogger);
// Rutas
var productController = new ProductController();
app.post('/products', function (req, res) { return productController.createProduct(req, res); });
app.patch('/products/:id/stock', function (req, res) { return productController.updateStock(req, res); });
app.get('/products/:id', function (req, res) { return productController.getProduct(req, res); });
// Endpoint de health check
app.get('/health', function (req, res) {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
// Endpoint de métricas
app.get('/metrics', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.setHeader('Content-Type', 'text/plain');
        res.end('metrics endpoint');
        return [2 /*return*/];
    });
}); });
// Manejo de errores global
app.use(function (error, req, res, next) {
    src_2.logger.error('Unhandled error', error, {
        url: req.url,
        method: req.method,
        correlationId: req.headers['x-correlation-id'],
    });
    res.status(500).json({
        error: 'Internal server error',
        correlationId: req.headers['x-correlation-id'],
    });
});
// Iniciar servidor
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    src_2.logger.info("Product service started on port ".concat(PORT), {
        serviceName: 'product-service',
        port: PORT,
        environment: process.env.NODE_ENV,
    });
});
// Manejo de shutdown graceful
process.on('SIGTERM', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                src_2.logger.info('Received SIGTERM, shutting down gracefully');
                return [4 /*yield*/, observability.shutdown()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                src_2.logger.info('Received SIGINT, shutting down gracefully');
                return [4 /*yield*/, observability.shutdown()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
