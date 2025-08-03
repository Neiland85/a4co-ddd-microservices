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
exports.BatchProcessor = exports.PerformanceTimer = exports.CircuitBreaker = void 0;
exports.generateCorrelationId = generateCorrelationId;
exports.generateCausationId = generateCausationId;
exports.sanitize = sanitize;
exports.formatDuration = formatDuration;
exports.createInstrumentedHttpClient = createInstrumentedHttpClient;
exports.retryWithBackoff = retryWithBackoff;
var uuid_1 = require("uuid");
var axios_1 = require("axios");
var api_1 = require("@opentelemetry/api");
var context_1 = require("../context");
var logger_1 = require("../logger");
// Generate correlation ID
function generateCorrelationId() {
    return (0, uuid_1.v4)();
}
// Generate causation ID from correlation ID
function generateCausationId(correlationId) {
    return "".concat(correlationId, "-").concat(Date.now());
}
// Sanitize sensitive data
function sanitize(data, sensitiveKeys) {
    if (sensitiveKeys === void 0) { sensitiveKeys = ['password', 'token', 'apiKey', 'secret']; }
    if (!data || typeof data !== 'object') {
        return data;
    }
    if (Array.isArray(data)) {
        return data.map(function (item) { return sanitize(item, sensitiveKeys); });
    }
    var sanitized = __assign({}, data);
    Object.keys(sanitized).forEach(function (key) {
        var lowerKey = key.toLowerCase();
        if (sensitiveKeys.some(function (sensitive) { return lowerKey.includes(sensitive.toLowerCase()); })) {
            sanitized[key] = '[REDACTED]';
        }
        else if (typeof sanitized[key] === 'object') {
            sanitized[key] = sanitize(sanitized[key], sensitiveKeys);
        }
    });
    return sanitized;
}
// Format duration for logging
function formatDuration(ms) {
    if (ms < 1000) {
        return "".concat(ms, "ms");
    }
    else if (ms < 60000) {
        return "".concat((ms / 1000).toFixed(2), "s");
    }
    else {
        return "".concat((ms / 60000).toFixed(2), "m");
    }
}
// Create instrumented HTTP client
function createInstrumentedHttpClient(config) {
    var client = axios_1.default.create(config);
    var logger = (0, logger_1.getLogger)();
    // Request interceptor
    client.interceptors.request.use(function (config) {
        var _a, _b;
        var ctx = (0, context_1.getContext)();
        // Inject context headers
        if (ctx) {
            config.headers = __assign(__assign({}, config.headers), (0, context_1.injectContextToHeaders)(ctx));
        }
        // Start span
        var span = api_1.trace.getTracer('@a4co/observability').startSpan("HTTP ".concat((_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase(), " ").concat(config.url), {
            kind: api_1.SpanKind.CLIENT,
            attributes: {
                'http.method': (_b = config.method) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                'http.url': config.url,
                'http.target': new URL(config.url || '', config.baseURL || 'http://localhost').pathname,
            },
        });
        // Attach span to config for response
        config.__span = span;
        config.__startTime = Date.now();
        logger.debug({
            method: config.method,
            url: config.url,
            headers: sanitize(config.headers),
        }, 'HTTP request started');
        return config;
    }, function (error) {
        logger.error({ error: error }, 'HTTP request failed to start');
        return Promise.reject(error);
    });
    // Response interceptor
    client.interceptors.response.use(function (response) {
        var span = response.config.__span;
        var startTime = response.config.__startTime;
        var duration = Date.now() - startTime;
        if (span) {
            span.setAttributes({
                'http.status_code': response.status,
                'http.response.size': JSON.stringify(response.data).length,
            });
            span.setStatus({ code: api_1.SpanStatusCode.OK });
            span.end();
        }
        logger.debug({
            method: response.config.method,
            url: response.config.url,
            status: response.status,
            duration: duration,
        }, 'HTTP request completed');
        return response;
    }, function (error) {
        var _a, _b, _c, _d, _e, _f;
        var span = (_a = error.config) === null || _a === void 0 ? void 0 : _a.__span;
        var startTime = (_b = error.config) === null || _b === void 0 ? void 0 : _b.__startTime;
        var duration = startTime ? Date.now() - startTime : 0;
        if (span) {
            span.setAttributes({
                'http.status_code': ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 0,
                'error': true,
            });
            span.recordException(error);
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: error.message
            });
            span.end();
        }
        logger.error({
            method: (_d = error.config) === null || _d === void 0 ? void 0 : _d.method,
            url: (_e = error.config) === null || _e === void 0 ? void 0 : _e.url,
            status: (_f = error.response) === null || _f === void 0 ? void 0 : _f.status,
            duration: duration,
            error: error.message,
        }, 'HTTP request failed');
        return Promise.reject(error);
    });
    return client;
}
// Retry with exponential backoff
function retryWithBackoff(fn_1) {
    return __awaiter(this, arguments, void 0, function (fn, options) {
        var _a, maxRetries, _b, initialDelay, _c, maxDelay, _d, factor, onRetry, logger, lastError, _loop_1, attempt, state_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = options.maxRetries, maxRetries = _a === void 0 ? 3 : _a, _b = options.initialDelay, initialDelay = _b === void 0 ? 1000 : _b, _c = options.maxDelay, maxDelay = _c === void 0 ? 30000 : _c, _d = options.factor, factor = _d === void 0 ? 2 : _d, onRetry = options.onRetry;
                    logger = (0, logger_1.getLogger)();
                    _loop_1 = function (attempt) {
                        var _f, error_1, delay_1;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _g.trys.push([0, 2, , 4]);
                                    _f = {};
                                    return [4 /*yield*/, fn()];
                                case 1: return [2 /*return*/, (_f.value = _g.sent(), _f)];
                                case 2:
                                    error_1 = _g.sent();
                                    lastError = error_1;
                                    if (attempt === maxRetries) {
                                        logger.error({ error: lastError, attempts: attempt + 1 }, 'All retry attempts failed');
                                        throw lastError;
                                    }
                                    delay_1 = Math.min(initialDelay * Math.pow(factor, attempt), maxDelay);
                                    logger.warn({
                                        error: lastError.message,
                                        attempt: attempt + 1,
                                        nextRetryIn: delay_1,
                                    }, 'Operation failed, retrying');
                                    if (onRetry) {
                                        onRetry(lastError, attempt + 1);
                                    }
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                                case 3:
                                    _g.sent();
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    attempt = 0;
                    _e.label = 1;
                case 1:
                    if (!(attempt <= maxRetries)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(attempt)];
                case 2:
                    state_1 = _e.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _e.label = 3;
                case 3:
                    attempt++;
                    return [3 /*break*/, 1];
                case 4: throw lastError;
            }
        });
    });
}
// Circuit breaker implementation
var CircuitBreaker = /** @class */ (function () {
    function CircuitBreaker(fn, options) {
        if (options === void 0) { options = {}; }
        this.fn = fn;
        this.options = options;
        this.failures = 0;
        this.lastFailureTime = 0;
        this.state = 'closed';
    }
    CircuitBreaker.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, failureThreshold, _c, resetTimeout, logger, result, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this.options, _b = _a.failureThreshold, failureThreshold = _b === void 0 ? 5 : _b, _c = _a.resetTimeout, resetTimeout = _c === void 0 ? 60000 : _c;
                        logger = (0, logger_1.getLogger)();
                        // Check if circuit should be reset
                        if (this.state === 'open' && Date.now() - this.lastFailureTime > resetTimeout) {
                            this.setState('half-open');
                        }
                        if (this.state === 'open') {
                            logger.warn('Circuit breaker is open, rejecting request');
                            throw new Error('Circuit breaker is open');
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.fn()];
                    case 2:
                        result = _d.sent();
                        if (this.state === 'half-open') {
                            this.setState('closed');
                            this.failures = 0;
                        }
                        return [2 /*return*/, result];
                    case 3:
                        error_2 = _d.sent();
                        this.failures++;
                        this.lastFailureTime = Date.now();
                        if (this.failures >= failureThreshold) {
                            this.setState('open');
                        }
                        logger.error({
                            error: error_2,
                            failures: this.failures,
                            state: this.state,
                        }, 'Circuit breaker execution failed');
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CircuitBreaker.prototype.setState = function (state) {
        if (this.state !== state) {
            this.state = state;
            if (this.options.onStateChange) {
                this.options.onStateChange(state);
            }
            (0, logger_1.getLogger)().info({
                previousState: this.state,
                newState: state
            }, 'Circuit breaker state changed');
        }
    };
    return CircuitBreaker;
}());
exports.CircuitBreaker = CircuitBreaker;
// Performance timer utility
var PerformanceTimer = /** @class */ (function () {
    function PerformanceTimer() {
        this.startTime = Date.now();
        this.marks = new Map();
    }
    PerformanceTimer.prototype.mark = function (name) {
        this.marks.set(name, Date.now());
    };
    PerformanceTimer.prototype.measure = function (name, startMark, endMark) {
        var start = startMark ? this.marks.get(startMark) : this.startTime;
        var end = endMark ? this.marks.get(endMark) : Date.now();
        if (!start || !end) {
            throw new Error('Invalid marks for measurement');
        }
        var duration = end - start;
        (0, logger_1.getLogger)().debug({
            measurement: name,
            duration: duration,
            startMark: startMark,
            endMark: endMark,
        }, 'Performance measurement');
        return duration;
    };
    PerformanceTimer.prototype.reset = function () {
        this.startTime = Date.now();
        this.marks.clear();
    };
    return PerformanceTimer;
}());
exports.PerformanceTimer = PerformanceTimer;
// Batch processor for aggregating operations
var BatchProcessor = /** @class */ (function () {
    function BatchProcessor(processor, options) {
        if (options === void 0) { options = {}; }
        this.processor = processor;
        this.options = options;
        this.batch = [];
        this.timer = null;
    }
    BatchProcessor.prototype.add = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, maxBatchSize, _c, flushInterval;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this.options, _b = _a.maxBatchSize, maxBatchSize = _b === void 0 ? 100 : _b, _c = _a.flushInterval, flushInterval = _c === void 0 ? 1000 : _c;
                        this.batch.push(item);
                        if (!(this.batch.length >= maxBatchSize)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.flush()];
                    case 1:
                        _d.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        if (!this.timer) {
                            this.timer = setTimeout(function () { return _this.flush(); }, flushInterval);
                        }
                        _d.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BatchProcessor.prototype.flush = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.timer) {
                            clearTimeout(this.timer);
                            this.timer = null;
                        }
                        if (this.batch.length === 0) {
                            return [2 /*return*/];
                        }
                        items = __spreadArray([], this.batch, true);
                        this.batch = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.processor(items)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        (0, logger_1.getLogger)().error({ error: error_3, batchSize: items.length }, 'Batch processing failed');
                        if (this.options.onError) {
                            this.options.onError(error_3, items);
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return BatchProcessor;
}());
exports.BatchProcessor = BatchProcessor;
