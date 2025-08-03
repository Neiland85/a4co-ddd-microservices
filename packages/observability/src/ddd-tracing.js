"use strict";
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
exports.DDDContext = void 0;
exports.TraceAggregateMethod = TraceAggregateMethod;
exports.TraceCommand = TraceCommand;
exports.TraceEventHandler = TraceEventHandler;
exports.createDomainSpan = createDomainSpan;
exports.injectNATSTraceContext = injectNATSTraceContext;
exports.extractNATSTraceContext = extractNATSTraceContext;
exports.dddContextMiddleware = dddContextMiddleware;
exports.traceDomainTransaction = traceDomainTransaction;
var api_1 = require("@opentelemetry/api");
var tracer_1 = require("./tracer");
// Decorador para métodos de agregados
function TraceAggregateMethod(aggregateName) {
    return function (target, propertyName, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var tracer, span, activeContext, correlationId, userId, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tracer = (0, tracer_1.getTracer)('ddd-aggregate');
                            span = tracer.startSpan("".concat(aggregateName, ".").concat(propertyName), {
                                kind: api_1.SpanKind.INTERNAL,
                                attributes: {
                                    'ddd.aggregate.name': aggregateName,
                                    'ddd.method.name': propertyName,
                                    'ddd.method.type': 'aggregate',
                                },
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            activeContext = api_1.context.active();
                            correlationId = activeContext.getValue('correlationId');
                            userId = activeContext.getValue('userId');
                            if (correlationId) {
                                span.setAttribute('ddd.correlation_id', correlationId);
                            }
                            if (userId) {
                                span.setAttribute('ddd.user_id', userId);
                            }
                            return [4 /*yield*/, method.apply(this, args)];
                        case 2:
                            result = _a.sent();
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            return [2 /*return*/, result];
                        case 3:
                            error_1 = _a.sent();
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: error_1 instanceof Error ? error_1.message : String(error_1),
                            });
                            span.recordException(error_1);
                            throw error_1;
                        case 4:
                            span.end();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
    };
}
// Decorador para comandos
function TraceCommand(commandName) {
    return function (target, propertyName, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var tracer, span, command, result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tracer = (0, tracer_1.getTracer)('ddd-command');
                            span = tracer.startSpan("command.".concat(commandName), {
                                kind: api_1.SpanKind.INTERNAL,
                                attributes: {
                                    'ddd.command.name': commandName,
                                    'ddd.command.handler': target.constructor.name,
                                    'ddd.command.method': propertyName,
                                },
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            command = args[0];
                            if (command) {
                                if (command.commandId) {
                                    span.setAttribute('ddd.command.id', command.commandId);
                                }
                                if (command.aggregateId) {
                                    span.setAttribute('ddd.aggregate.id', command.aggregateId);
                                }
                                if (command.userId) {
                                    span.setAttribute('ddd.user.id', command.userId);
                                }
                                if (command.correlationId) {
                                    span.setAttribute('ddd.correlation.id', command.correlationId);
                                }
                            }
                            return [4 /*yield*/, method.apply(this, args)];
                        case 2:
                            result = _a.sent();
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            return [2 /*return*/, result];
                        case 3:
                            error_2 = _a.sent();
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: error_2 instanceof Error ? error_2.message : String(error_2),
                            });
                            span.recordException(error_2);
                            throw error_2;
                        case 4:
                            span.end();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
    };
}
// Decorador para event handlers
function TraceEventHandler(eventName) {
    return function (target, propertyName, descriptor) {
        var method = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var tracer, span, event_1, result, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tracer = (0, tracer_1.getTracer)('ddd-event');
                            span = tracer.startSpan("event.".concat(eventName), {
                                kind: api_1.SpanKind.INTERNAL,
                                attributes: {
                                    'ddd.event.name': eventName,
                                    'ddd.event.handler': target.constructor.name,
                                    'ddd.event.method': propertyName,
                                },
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            event_1 = args[0];
                            if (event_1) {
                                if (event_1.eventId) {
                                    span.setAttribute('ddd.event.id', event_1.eventId);
                                }
                                if (event_1.aggregateId) {
                                    span.setAttribute('ddd.aggregate.id', event_1.aggregateId);
                                }
                                if (event_1.correlationId) {
                                    span.setAttribute('ddd.correlation.id', event_1.correlationId);
                                }
                                if (event_1.causationId) {
                                    span.setAttribute('ddd.causation.id', event_1.causationId);
                                }
                            }
                            return [4 /*yield*/, method.apply(this, args)];
                        case 2:
                            result = _a.sent();
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            return [2 /*return*/, result];
                        case 3:
                            error_3 = _a.sent();
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: error_3 instanceof Error ? error_3.message : String(error_3),
                            });
                            span.recordException(error_3);
                            throw error_3;
                        case 4:
                            span.end();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
    };
}
// Clase para manejo de contexto DDD
var DDDContext = /** @class */ (function () {
    function DDDContext() {
    }
    DDDContext.setCorrelationId = function (correlationId) {
        api_1.context.active().setValue(this.correlationIdKey, correlationId);
    };
    DDDContext.getCorrelationId = function () {
        return api_1.context.active().getValue(this.correlationIdKey);
    };
    DDDContext.setUserId = function (userId) {
        api_1.context.active().setValue(this.userIdKey, userId);
    };
    DDDContext.getUserId = function () {
        return api_1.context.active().getValue(this.userIdKey);
    };
    DDDContext.setCausationId = function (causationId) {
        api_1.context.active().setValue(this.causationIdKey, causationId);
    };
    DDDContext.getCausationId = function () {
        return api_1.context.active().getValue(this.causationIdKey);
    };
    DDDContext.createContext = function (metadata) {
        var ctx = api_1.context.active();
        if (metadata.correlationId) {
            ctx = ctx.setValue(this.correlationIdKey, metadata.correlationId);
        }
        if (metadata.userId) {
            ctx = ctx.setValue(this.userIdKey, metadata.userId);
        }
        if (metadata.causationId) {
            ctx = ctx.setValue(this.causationIdKey, metadata.causationId);
        }
        return ctx;
    };
    DDDContext.correlationIdKey = Symbol('correlationId');
    DDDContext.userIdKey = Symbol('userId');
    DDDContext.causationIdKey = Symbol('causationId');
    return DDDContext;
}());
exports.DDDContext = DDDContext;
// Función para crear spans de dominio
function createDomainSpan(operation, metadata, kind) {
    if (kind === void 0) { kind = api_1.SpanKind.INTERNAL; }
    var tracer = (0, tracer_1.getTracer)('ddd-domain');
    var span = tracer.startSpan(operation, { kind: kind });
    // Establecer atributos comunes
    if ('aggregateName' in metadata) {
        span.setAttribute('ddd.aggregate.name', metadata.aggregateName);
        span.setAttribute('ddd.aggregate.id', metadata.aggregateId);
    }
    if ('commandName' in metadata) {
        span.setAttribute('ddd.command.name', metadata.commandName);
        span.setAttribute('ddd.command.id', metadata.commandId);
        if (metadata.aggregateId) {
            span.setAttribute('ddd.aggregate.id', metadata.aggregateId);
        }
        if (metadata.userId) {
            span.setAttribute('ddd.user.id', metadata.userId);
        }
        if (metadata.correlationId) {
            span.setAttribute('ddd.correlation.id', metadata.correlationId);
        }
    }
    if ('eventName' in metadata) {
        span.setAttribute('ddd.event.name', metadata.eventName);
        span.setAttribute('ddd.event.id', metadata.eventId);
        if (metadata.aggregateId) {
            span.setAttribute('ddd.aggregate.id', metadata.aggregateId);
        }
        if (metadata.correlationId) {
            span.setAttribute('ddd.correlation.id', metadata.correlationId);
        }
        if (metadata.causationId) {
            span.setAttribute('ddd.causation.id', metadata.causationId);
        }
    }
    return span;
}
// Función para propagar contexto en mensajes NATS
function injectNATSTraceContext(headers) {
    var activeContext = api_1.context.active();
    var correlationId = DDDContext.getCorrelationId();
    var userId = DDDContext.getUserId();
    var causationId = DDDContext.getCausationId();
    var traceHeaders = __assign(__assign({}, headers), { 'x-correlation-id': correlationId || '', 'x-user-id': userId || '', 'x-causation-id': causationId || '' });
    // Inyectar contexto de OpenTelemetry
    var tracer = (0, tracer_1.getTracer)('ddd-nats');
    var span = tracer.startSpan('nats.message.inject');
    try {
        // Aquí se inyectaría el contexto de trace en los headers
        // usando el propagator de OpenTelemetry
        span.setAttributes({
            'messaging.system': 'nats',
            'messaging.operation': 'publish',
        });
    }
    finally {
        span.end();
    }
    return traceHeaders;
}
// Función para extraer contexto de mensajes NATS
function extractNATSTraceContext(headers) {
    var correlationId = headers['x-correlation-id'];
    var userId = headers['x-user-id'];
    var causationId = headers['x-causation-id'];
    if (correlationId) {
        DDDContext.setCorrelationId(correlationId);
    }
    if (userId) {
        DDDContext.setUserId(userId);
    }
    if (causationId) {
        DDDContext.setCausationId(causationId);
    }
    // Extraer contexto de trace de OpenTelemetry
    var tracer = (0, tracer_1.getTracer)('ddd-nats');
    var span = tracer.startSpan('nats.message.extract');
    try {
        span.setAttributes({
            'messaging.system': 'nats',
            'messaging.operation': 'consume',
            'ddd.correlation.id': correlationId,
            'ddd.user.id': userId,
            'ddd.causation.id': causationId,
        });
    }
    finally {
        span.end();
    }
}
// Middleware para Express/Koa que propaga contexto DDD
function dddContextMiddleware() {
    return function (req, res, next) {
        var correlationId = req.headers['x-correlation-id'] || req.headers['x-request-id'];
        var userId = req.headers['x-user-id'];
        var causationId = req.headers['x-causation-id'];
        if (correlationId) {
            DDDContext.setCorrelationId(correlationId);
        }
        if (userId) {
            DDDContext.setUserId(userId);
        }
        if (causationId) {
            DDDContext.setCausationId(causationId);
        }
        // Agregar headers de respuesta para propagar el contexto
        res.setHeader('x-correlation-id', correlationId || '');
        res.setHeader('x-user-id', userId || '');
        res.setHeader('x-causation-id', causationId || '');
        next();
    };
}
// Función para crear spans de transacciones de dominio
function traceDomainTransaction(operation, metadata, fn) {
    var _this = this;
    var span = createDomainSpan(operation, metadata);
    return api_1.context.with(DDDContext.createContext({
        correlationId: metadata.correlationId,
        userId: metadata.userId,
        causationId: metadata.causationId,
    }), function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, fn()];
                case 1:
                    result = _a.sent();
                    span.setStatus({ code: api_1.SpanStatusCode.OK });
                    return [2 /*return*/, result];
                case 2:
                    error_4 = _a.sent();
                    span.setStatus({
                        code: api_1.SpanStatusCode.ERROR,
                        message: error_4 instanceof Error ? error_4.message : String(error_4),
                    });
                    span.recordException(error_4);
                    throw error_4;
                case 3:
                    span.end();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
