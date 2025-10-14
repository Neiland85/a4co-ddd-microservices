"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchProcessor = exports.PerformanceTimer = exports.CircuitBreaker = void 0;
exports.generateCorrelationId = generateCorrelationId;
exports.generateCausationId = generateCausationId;
exports.sanitize = sanitize;
exports.formatDuration = formatDuration;
exports.createInstrumentedHttpClient = createInstrumentedHttpClient;
exports.retryWithBackoff = retryWithBackoff;
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const api_1 = require("@opentelemetry/api");
const context_1 = require("../context");
const logger_1 = require("../logger");
// Generate correlation ID
function generateCorrelationId() {
    return (0, uuid_1.v4)();
}
// Generate causation ID from correlation ID
function generateCausationId(correlationId) {
    return `${correlationId}-${Date.now()}`;
}
// Sanitize sensitive data
function sanitize(data, sensitiveKeys = ['password', 'token', 'apiKey', 'secret']) {
    if (!data || typeof data !== 'object') {
        return data;
    }
    if (Array.isArray(data)) {
        return data.map(item => sanitize(item, sensitiveKeys));
    }
    const sanitized = { ...data };
    Object.keys(sanitized).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive.toLowerCase()))) {
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
        return `${ms}ms`;
    }
    else if (ms < 60000) {
        return `${(ms / 1000).toFixed(2)}s`;
    }
    else {
        return `${(ms / 60000).toFixed(2)}m`;
    }
}
// Create instrumented HTTP client
function createInstrumentedHttpClient(config) {
    const client = axios_1.default.create(config);
    const logger = (0, logger_1.getLogger)();
    // Request interceptor
    client.interceptors.request.use(config => {
        const ctx = (0, context_1.getContext)();
        // Inject context headers
        if (ctx) {
            config.headers = {
                ...config.headers,
                ...(0, context_1.injectContextToHeaders)(ctx),
            };
        }
        // Start span
        const span = api_1.trace
            .getTracer('@a4co/observability')
            .startSpan(`HTTP ${config.method?.toUpperCase()} ${config.url}`, {
            kind: api_1.SpanKind.CLIENT,
            attributes: {
                'http.method': config.method?.toUpperCase(),
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
    }, error => {
        logger.error({ error }, 'HTTP request failed to start');
        return Promise.reject(error);
    });
    // Response interceptor
    client.interceptors.response.use(response => {
        const span = response.config.__span;
        const startTime = response.config.__startTime;
        const duration = Date.now() - startTime;
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
            duration,
        }, 'HTTP request completed');
        return response;
    }, error => {
        const span = error.config?.__span;
        const startTime = error.config?.__startTime;
        const duration = startTime ? Date.now() - startTime : 0;
        if (span) {
            span.setAttributes({
                'http.status_code': error.response?.status || 0,
                error: true,
            });
            span.recordException(error);
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: error.message,
            });
            span.end();
        }
        logger.error({
            method: error.config?.method,
            url: error.config?.url,
            status: error.response?.status,
            duration,
            error: error.message,
        }, 'HTTP request failed');
        return Promise.reject(error);
    });
    return client;
}
// Retry with exponential backoff
async function retryWithBackoff(fn, options = {}) {
    const { maxRetries = 3, initialDelay = 1000, maxDelay = 30000, factor = 2, onRetry } = options;
    const logger = (0, logger_1.getLogger)();
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt === maxRetries) {
                logger.error({ error: lastError, attempts: attempt + 1 }, 'All retry attempts failed');
                throw lastError;
            }
            const delay = Math.min(initialDelay * Math.pow(factor, attempt), maxDelay);
            logger.warn({
                error: lastError.message,
                attempt: attempt + 1,
                nextRetryIn: delay,
            }, 'Operation failed, retrying');
            if (onRetry) {
                onRetry(lastError, attempt + 1);
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}
// Circuit breaker implementation
class CircuitBreaker {
    fn;
    options;
    failures = 0;
    lastFailureTime = 0;
    state = 'closed';
    constructor(fn, options = {}) {
        this.fn = fn;
        this.options = options;
    }
    async execute() {
        const { failureThreshold = 5, resetTimeout = 60000 } = this.options;
        const logger = (0, logger_1.getLogger)();
        // Check if circuit should be reset
        if (this.state === 'open' && Date.now() - this.lastFailureTime > resetTimeout) {
            this.setState('half-open');
        }
        if (this.state === 'open') {
            logger.warn('Circuit breaker is open, rejecting request');
            throw new Error('Circuit breaker is open');
        }
        try {
            const result = await this.fn();
            if (this.state === 'half-open') {
                this.setState('closed');
                this.failures = 0;
            }
            return result;
        }
        catch (error) {
            this.failures++;
            this.lastFailureTime = Date.now();
            if (this.failures >= failureThreshold) {
                this.setState('open');
            }
            logger.error({
                error,
                failures: this.failures,
                state: this.state,
            }, 'Circuit breaker execution failed');
            throw error;
        }
    }
    setState(state) {
        if (this.state !== state) {
            this.state = state;
            if (this.options.onStateChange) {
                this.options.onStateChange(state);
            }
            (0, logger_1.getLogger)().info({
                previousState: this.state,
                newState: state,
            }, 'Circuit breaker state changed');
        }
    }
}
exports.CircuitBreaker = CircuitBreaker;
// Performance timer utility
class PerformanceTimer {
    startTime = Date.now();
    marks = new Map();
    mark(name) {
        this.marks.set(name, Date.now());
    }
    measure(name, startMark, endMark) {
        const start = startMark ? this.marks.get(startMark) : this.startTime;
        const end = endMark ? this.marks.get(endMark) : Date.now();
        if (!start || !end) {
            throw new Error('Invalid marks for measurement');
        }
        const duration = end - start;
        (0, logger_1.getLogger)().debug({
            measurement: name,
            duration,
            startMark,
            endMark,
        }, 'Performance measurement');
        return duration;
    }
    reset() {
        this.startTime = Date.now();
        this.marks.clear();
    }
}
exports.PerformanceTimer = PerformanceTimer;
// Batch processor for aggregating operations
class BatchProcessor {
    processor;
    options;
    batch = [];
    timer = null;
    constructor(processor, options = {}) {
        this.processor = processor;
        this.options = options;
    }
    async add(item) {
        const { maxBatchSize = 100, flushInterval = 1000 } = this.options;
        this.batch.push(item);
        if (this.batch.length >= maxBatchSize) {
            await this.flush();
        }
        else if (!this.timer) {
            this.timer = setTimeout(() => this.flush(), flushInterval);
        }
    }
    async flush() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        if (this.batch.length === 0) {
            return;
        }
        const items = [...this.batch];
        this.batch = [];
        try {
            await this.processor(items);
        }
        catch (error) {
            (0, logger_1.getLogger)().error({ error, batchSize: items.length }, 'Batch processing failed');
            if (this.options.onError) {
                this.options.onError(error, items);
            }
        }
    }
}
exports.BatchProcessor = BatchProcessor;
//# sourceMappingURL=index.js.map