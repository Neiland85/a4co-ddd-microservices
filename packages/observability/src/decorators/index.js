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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trace = Trace;
exports.Log = Log;
exports.CommandHandler = CommandHandler;
exports.EventHandler = EventHandler;
exports.Metrics = Metrics;
exports.CacheableWithObservability = CacheableWithObservability;
exports.Repository = Repository;
var api_1 = require("@opentelemetry/api");
var logger_1 = require("../logger");
var metrics_1 = require("../metrics");
// Trace decorator for methods
function Trace(options) {
    if (options === void 0) { options = {}; }
    return function (target, propertyName, descriptor) {
        var originalMethod = descriptor.value;
        var className = target.constructor.name;
        var spanName = options.name || "".concat(className, ".").concat(propertyName);
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var tracer, span, logger, result, error_1, err;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tracer = api_1.trace.getTracer('@a4co/observability');
                            span = tracer.startSpan(spanName, {
                                kind: api_1.SpanKind.INTERNAL,
                                attributes: __assign({ 'code.function': propertyName, 'code.namespace': className }, options.attributes),
                            });
                            logger = (0, logger_1.getLogger)().withContext({
                                spanId: span.spanContext().spanId,
                                traceId: span.spanContext().traceId,
                                method: propertyName,
                                class: className,
                            });
                            logger.debug({ args: options.recordResult ? args : undefined }, "".concat(spanName, " started"));
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, originalMethod.apply(this, args)];
                        case 2:
                            result = _a.sent();
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            if (options.recordResult) {
                                span.setAttribute('result', JSON.stringify(result));
                            }
                            logger.debug({ result: options.recordResult ? result : undefined }, "".concat(spanName, " completed"));
                            return [2 /*return*/, result];
                        case 3:
                            error_1 = _a.sent();
                            err = error_1;
                            if (options.recordException !== false) {
                                span.recordException(err);
                            }
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: err.message,
                            });
                            logger.error({ error: err, stack: err.stack }, "".concat(spanName, " failed"));
                            throw error_1;
                        case 4:
                            span.end();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return descriptor;
    };
}
// Log decorator for methods
function Log(level) {
    if (level === void 0) { level = 'info'; }
    return function (target, propertyName, descriptor) {
        var originalMethod = descriptor.value;
        var className = target.constructor.name;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var logger, methodName, result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            logger = (0, logger_1.getLogger)();
                            methodName = "".concat(className, ".").concat(propertyName);
                            logger[level]({ method: methodName, args: args }, "Executing ".concat(methodName));
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, originalMethod.apply(this, args)];
                        case 2:
                            result = _a.sent();
                            logger[level]({ method: methodName, result: result }, "".concat(methodName, " completed"));
                            return [2 /*return*/, result];
                        case 3:
                            error_2 = _a.sent();
                            logger.error({ method: methodName, error: error_2 }, "".concat(methodName, " failed"));
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return descriptor;
    };
}
// Command handler decorator for DDD
function CommandHandler(commandName, aggregateName) {
    return function (target, propertyName, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var tracer, span, logger, startTime, result, duration, error_3, err, duration;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tracer = api_1.trace.getTracer('@a4co/observability');
                            span = tracer.startSpan("command.".concat(commandName), {
                                kind: api_1.SpanKind.INTERNAL,
                                attributes: {
                                    'ddd.command.name': commandName,
                                    'ddd.aggregate.name': aggregateName,
                                    'ddd.handler': "".concat(target.constructor.name, ".").concat(propertyName),
                                },
                            });
                            logger = (0, logger_1.getLogger)().withDDD({
                                commandName: commandName,
                                aggregateName: aggregateName,
                            });
                            startTime = Date.now();
                            logger.info({ command: commandName, aggregate: aggregateName }, 'Command execution started');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, originalMethod.apply(this, args)];
                        case 2:
                            result = _a.sent();
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            duration = Date.now() - startTime;
                            logger.info({ command: commandName, duration: duration }, 'Command executed successfully');
                            (0, metrics_1.recordCommandExecution)(commandName, aggregateName, true, duration);
                            return [2 /*return*/, result];
                        case 3:
                            error_3 = _a.sent();
                            err = error_3;
                            span.recordException(err);
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: err.message,
                            });
                            duration = Date.now() - startTime;
                            logger.error({ command: commandName, error: err, duration: duration }, 'Command execution failed');
                            (0, metrics_1.recordCommandExecution)(commandName, aggregateName, false, duration);
                            throw error_3;
                        case 4:
                            span.end();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return descriptor;
    };
}
// Event handler decorator for DDD
function EventHandler(eventName, aggregateName) {
    return function (target, propertyName, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var tracer, span, logger, result, error_4, err;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tracer = api_1.trace.getTracer('@a4co/observability');
                            span = tracer.startSpan("event.".concat(eventName), {
                                kind: api_1.SpanKind.INTERNAL,
                                attributes: {
                                    'ddd.event.name': eventName,
                                    'ddd.aggregate.name': aggregateName,
                                    'ddd.handler': "".concat(target.constructor.name, ".").concat(propertyName),
                                },
                            });
                            logger = (0, logger_1.getLogger)().withDDD({
                                eventName: eventName,
                                aggregateName: aggregateName,
                            });
                            logger.info({ event: eventName, aggregate: aggregateName }, 'Event processing started');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, originalMethod.apply(this, args)];
                        case 2:
                            result = _a.sent();
                            span.setStatus({ code: api_1.SpanStatusCode.OK });
                            logger.info({ event: eventName }, 'Event processed successfully');
                            (0, metrics_1.recordEvent)(eventName, aggregateName, 'processed');
                            return [2 /*return*/, result];
                        case 3:
                            error_4 = _a.sent();
                            err = error_4;
                            span.recordException(err);
                            span.setStatus({
                                code: api_1.SpanStatusCode.ERROR,
                                message: err.message,
                            });
                            logger.error({ event: eventName, error: err }, 'Event processing failed');
                            throw error_4;
                        case 4:
                            span.end();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return descriptor;
    };
}
// Metrics decorator
function Metrics(metricName) {
    return function (target, propertyName, descriptor) {
        var originalMethod = descriptor.value;
        var className = target.constructor.name;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var startTime, result, duration, metrics, histogram, error_5, duration, metrics, histogram;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = Date.now();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 6]);
                            return [4 /*yield*/, originalMethod.apply(this, args)];
                        case 2:
                            result = _a.sent();
                            duration = Date.now() - startTime;
                            return [4 /*yield*/, Promise.resolve().then(function () { return require('../metrics'); })];
                        case 3:
                            metrics = _a.sent();
                            histogram = metrics.createCustomHistogram(metricName, "Duration of ".concat(className, ".").concat(propertyName), 'ms');
                            histogram.record(duration, {
                                class: className,
                                method: propertyName,
                                status: 'success',
                            });
                            return [2 /*return*/, result];
                        case 4:
                            error_5 = _a.sent();
                            duration = Date.now() - startTime;
                            return [4 /*yield*/, Promise.resolve().then(function () { return require('../metrics'); })];
                        case 5:
                            metrics = _a.sent();
                            histogram = metrics.createCustomHistogram(metricName, "Duration of ".concat(className, ".").concat(propertyName), 'ms');
                            histogram.record(duration, {
                                class: className,
                                method: propertyName,
                                status: 'error',
                            });
                            throw error_5;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        return descriptor;
    };
}
// Cache decorator with observability
function CacheableWithObservability(ttl) {
    if (ttl === void 0) { ttl = 300; }
    var cache = new Map();
    return function (target, propertyName, descriptor) {
        var originalMethod = descriptor.value;
        var className = target.constructor.name;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, logger, span, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = JSON.stringify(args);
                            cached = cache.get(cacheKey);
                            logger = (0, logger_1.getLogger)();
                            span = api_1.trace.getActiveSpan();
                            if (cached && cached.expiry > Date.now()) {
                                logger.debug({ method: "".concat(className, ".").concat(propertyName), cacheKey: cacheKey }, 'Cache hit');
                                if (span) {
                                    span.setAttribute('cache.hit', true);
                                }
                                return [2 /*return*/, cached.value];
                            }
                            logger.debug({ method: "".concat(className, ".").concat(propertyName), cacheKey: cacheKey }, 'Cache miss');
                            if (span) {
                                span.setAttribute('cache.hit', false);
                            }
                            return [4 /*yield*/, originalMethod.apply(this, args)];
                        case 1:
                            result = _a.sent();
                            cache.set(cacheKey, {
                                value: result,
                                expiry: Date.now() + ttl * 1000,
                            });
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        return descriptor;
    };
}
// Repository decorator for DDD
function Repository(aggregateName) {
    return function (constructor) {
        var originalConstructor = constructor;
        var wrappedConstructor = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var instance = new ((_a = originalConstructor).bind.apply(_a, __spreadArray([void 0], args, false)))();
            // Wrap common repository methods
            var methodsToWrap = ['save', 'findById', 'findAll', 'delete', 'update'];
            methodsToWrap.forEach(function (methodName) {
                if (typeof instance[methodName] === 'function') {
                    var originalMethod_1 = instance[methodName];
                    instance[methodName] = function () {
                        var methodArgs = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            methodArgs[_i] = arguments[_i];
                        }
                        return __awaiter(this, void 0, void 0, function () {
                            var span, logger, result, error_6;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        span = api_1.trace.getActiveSpan();
                                        if (span) {
                                            span.setAttribute('repository.aggregate', aggregateName);
                                            span.setAttribute('repository.method', methodName);
                                        }
                                        logger = (0, logger_1.getLogger)().withContext({
                                            repository: constructor.name,
                                            aggregate: aggregateName,
                                            method: methodName,
                                        });
                                        logger.debug({ args: methodArgs }, "Repository ".concat(methodName, " called"));
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, originalMethod_1.apply(this, methodArgs)];
                                    case 2:
                                        result = _a.sent();
                                        logger.debug({ result: result }, "Repository ".concat(methodName, " completed"));
                                        return [2 /*return*/, result];
                                    case 3:
                                        error_6 = _a.sent();
                                        logger.error({ error: error_6 }, "Repository ".concat(methodName, " failed"));
                                        throw error_6;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        });
                    };
                }
            });
            return instance;
        };
        wrappedConstructor.prototype = originalConstructor.prototype;
        return wrappedConstructor;
    };
}
