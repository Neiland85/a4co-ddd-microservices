"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secureAxiosFactory = exports.SecureAxiosFactory = exports.SecureAxiosClient = exports.MemoryMonitor = exports.RateLimiter = exports.CircuitBreaker = exports.CircuitState = void 0;
const axios_1 = __importDefault(require("axios"));
const events_1 = require("events");
var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "CLOSED";
    CircuitState["OPEN"] = "OPEN";
    CircuitState["HALF_OPEN"] = "HALF_OPEN";
})(CircuitState || (exports.CircuitState = CircuitState = {}));
class CircuitBreaker {
    constructor(config) {
        this.config = config;
        this.state = CircuitState.CLOSED;
        this.failures = 0;
        this.lastFailureTime = 0;
        this.successCount = 0;
    }
    async execute(operation) {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() - this.lastFailureTime > this.config.recoveryTimeout) {
                this.state = CircuitState.HALF_OPEN;
                this.successCount = 0;
            }
            else {
                throw new Error('Circuit breaker is OPEN');
            }
        }
        try {
            const result = await operation();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    onSuccess() {
        this.failures = 0;
        if (this.state === CircuitState.HALF_OPEN) {
            this.successCount++;
            if (this.successCount >= (this.config.successThreshold || 3)) {
                this.state = CircuitState.CLOSED;
            }
        }
    }
    onFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        if (Date.now() - this.lastFailureTime > this.config.monitoringWindow) {
            this.failures = 1;
        }
        if (this.failures >= this.config.failureThreshold) {
            this.state = CircuitState.OPEN;
        }
    }
    getState() {
        return this.state;
    }
    getStats() {
        return {
            state: this.state,
            failures: this.failures,
            lastFailureTime: this.lastFailureTime,
            successCount: this.successCount,
        };
    }
}
exports.CircuitBreaker = CircuitBreaker;
class RateLimiter {
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.tokens = maxRequests;
        this.lastRefill = Date.now();
    }
    async acquire() {
        const now = Date.now();
        const timePassed = now - this.lastRefill;
        const tokensToAdd = Math.floor((timePassed / this.windowMs) * this.maxRequests);
        this.tokens = Math.min(this.maxRequests, this.tokens + tokensToAdd);
        this.lastRefill = now;
        if (this.tokens <= 0) {
            throw new Error('Rate limit exceeded');
        }
        this.tokens--;
    }
}
exports.RateLimiter = RateLimiter;
class MemoryMonitor {
    constructor(thresholdPercent = 80) {
        this.thresholdPercent = thresholdPercent;
        this.eventEmitter = new events_1.EventEmitter();
        this.lastMemoryUsage = process.memoryUsage();
    }
    start(intervalMs = 30000) {
        this.intervalId = setInterval(() => {
            this.checkMemoryUsage();
        }, intervalMs);
    }
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }
    checkMemoryUsage() {
        const memUsage = process.memoryUsage();
        const rssMB = memUsage.rss / 1024 / 1024;
        const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
        const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
        const heapUsagePercent = (heapUsedMB / heapTotalMB) * 100;
        if (heapUsagePercent > this.thresholdPercent) {
            this.eventEmitter.emit('memoryThresholdExceeded', {
                rss: rssMB,
                heapUsed: heapUsedMB,
                heapTotal: heapTotalMB,
                usagePercent: heapUsagePercent,
                threshold: this.thresholdPercent,
            });
        }
        const rssIncrease = memUsage.rss - this.lastMemoryUsage.rss;
        if (rssIncrease > 50 * 1024 * 1024) {
            this.eventEmitter.emit('memoryLeakDetected', {
                increaseMB: rssIncrease / 1024 / 1024,
                currentRSS: rssMB,
            });
        }
        this.lastMemoryUsage = memUsage;
    }
    on(event, listener) {
        this.eventEmitter.on(event, listener);
    }
    getCurrentUsage() {
        const memUsage = process.memoryUsage();
        return {
            rss: memUsage.rss / 1024 / 1024,
            heapUsed: memUsage.heapUsed / 1024 / 1024,
            heapTotal: memUsage.heapTotal / 1024 / 1024,
            external: memUsage.external / 1024 / 1024,
        };
    }
}
exports.MemoryMonitor = MemoryMonitor;
class SecureAxiosClient {
    constructor(baseURL, securityConfig = {}) {
        this.config = {
            maxContentLength: 10 * 1024 * 1024,
            maxBodyLength: 10 * 1024 * 1024,
            maxResponseSize: 50 * 1024 * 1024,
            timeout: 30000,
            connectTimeout: 10000,
            circuitBreakerEnabled: true,
            failureThreshold: 5,
            recoveryTimeout: 60000,
            monitoringWindow: 60000,
            rateLimitEnabled: false,
            maxRequestsPerMinute: 60,
            retryEnabled: true,
            maxRetries: 3,
            retryDelay: 1000,
            memoryMonitoringEnabled: true,
            memoryThreshold: 80,
            ...securityConfig,
        };
        this.circuitBreaker = new CircuitBreaker({
            failureThreshold: this.config.failureThreshold,
            recoveryTimeout: this.config.recoveryTimeout,
            monitoringWindow: this.config.monitoringWindow,
        });
        if (this.config.rateLimitEnabled) {
            this.rateLimiter = new RateLimiter(this.config.maxRequestsPerMinute, 60000);
        }
        this.memoryMonitor = new MemoryMonitor(this.config.memoryThreshold);
        this.axiosInstance = axios_1.default.create({
            baseURL,
            timeout: this.config.timeout,
            maxContentLength: this.config.maxContentLength,
            maxBodyLength: this.config.maxBodyLength,
            transitional: {
                clarifyTimeoutError: true,
            },
            headers: {
                'User-Agent': 'SecureAxiosClient/1.0',
                'Accept-Encoding': 'gzip, deflate, br',
            },
        });
        this.setupInterceptors();
        this.setupMemoryMonitoring();
    }
    setupInterceptors() {
        this.axiosInstance.interceptors.request.use((config) => {
            if (config.data) {
                const dataSize = this.calculateDataSize(config.data);
                if (dataSize > this.config.maxBodyLength) {
                    throw new Error(`Request body too large: ${dataSize} bytes (max: ${this.config.maxBodyLength})`);
                }
            }
            if (config.headers) {
                config.headers['X-Request-Size'] = config.data
                    ? this.calculateDataSize(config.data)
                    : 0;
            }
            else {
                config.headers = {
                    'X-Request-Size': config.data ? this.calculateDataSize(config.data) : 0,
                };
            }
            return config;
        }, error => Promise.reject(error));
        this.axiosInstance.interceptors.response.use((response) => {
            const responseSize = this.calculateResponseSize(response);
            if (responseSize > this.config.maxResponseSize) {
                throw new Error(`Response too large: ${responseSize} bytes (max: ${this.config.maxResponseSize})`);
            }
            response.metadata = {
                size: responseSize,
                timestamp: Date.now(),
            };
            return response;
        }, async (error) => {
            if (this.config.circuitBreakerEnabled) {
                try {
                    return await this.circuitBreaker.execute(() => {
                        throw error;
                    });
                }
                catch (circuitError) {
                    throw new Error(`Circuit breaker open: ${error.message}`);
                }
            }
            if (this.shouldRetry(error) && this.config.retryEnabled) {
                return this.retryRequest(error.config);
            }
            throw error;
        });
    }
    setupMemoryMonitoring() {
        if (this.config.memoryMonitoringEnabled) {
            this.memoryMonitor.start();
            this.memoryMonitor.on('memoryThresholdExceeded', data => {
                console.warn('[!] Memory threshold exceeded:', data);
            });
            this.memoryMonitor.on('memoryLeakDetected', data => {
                console.error('💥 Memory leak detected:', data);
            });
        }
    }
    shouldRetry(error) {
        if (!error.config || !this.config.retryEnabled)
            return false;
        const retryableStatuses = [408, 429, 500, 502, 503, 504];
        const isRetryableStatus = error.response?.status
            ? retryableStatuses.includes(error.response.status)
            : false;
        const isNetworkError = !error.response && error.code !== 'ECONNABORTED';
        return isRetryableStatus || isNetworkError;
    }
    async retryRequest(config, attempt = 1) {
        if (attempt > this.config.maxRetries) {
            throw new Error(`Max retries exceeded (${this.config.maxRetries})`);
        }
        const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.axiosInstance.request(config);
    }
    calculateDataSize(data) {
        if (!data)
            return 0;
        if (typeof data === 'string')
            return Buffer.byteLength(data, 'utf8');
        if (Buffer.isBuffer(data))
            return data.length;
        if (data instanceof ArrayBuffer)
            return data.byteLength;
        try {
            return Buffer.byteLength(JSON.stringify(data), 'utf8');
        }
        catch {
            return 0;
        }
    }
    calculateResponseSize(response) {
        let size = 0;
        Object.entries(response.headers).forEach(([key, value]) => {
            size += Buffer.byteLength(`${key}: ${value}`, 'utf8');
        });
        if (response.data) {
            size += this.calculateDataSize(response.data);
        }
        return size;
    }
    async get(url, config) {
        return this.executeWithSecurity(() => this.axiosInstance.get(url, config));
    }
    async post(url, data, config) {
        return this.executeWithSecurity(() => this.axiosInstance.post(url, data, config));
    }
    async put(url, data, config) {
        return this.executeWithSecurity(() => this.axiosInstance.put(url, data, config));
    }
    async delete(url, config) {
        return this.executeWithSecurity(() => this.axiosInstance.delete(url, config));
    }
    async patch(url, data, config) {
        return this.executeWithSecurity(() => this.axiosInstance.patch(url, data, config));
    }
    async executeWithSecurity(operation) {
        if (this.rateLimiter) {
            await this.rateLimiter.acquire();
        }
        if (this.config.circuitBreakerEnabled) {
            return this.circuitBreaker.execute(operation);
        }
        return operation();
    }
    getSecurityStats() {
        return {
            circuitBreaker: this.circuitBreaker.getStats(),
            memoryUsage: this.memoryMonitor.getCurrentUsage(),
            config: this.config,
        };
    }
    destroy() {
        this.memoryMonitor.stop();
    }
}
exports.SecureAxiosClient = SecureAxiosClient;
class SecureAxiosFactory {
    static createClient(baseURL, config) {
        return new SecureAxiosClient(baseURL, config);
    }
    static createDefaultConfig() {
        return {
            maxContentLength: 10 * 1024 * 1024,
            maxBodyLength: 10 * 1024 * 1024,
            maxResponseSize: 50 * 1024 * 1024,
            timeout: 30000,
            connectTimeout: 10000,
            circuitBreakerEnabled: true,
            failureThreshold: 5,
            recoveryTimeout: 60000,
            monitoringWindow: 60000,
            rateLimitEnabled: false,
            maxRequestsPerMinute: 60,
            retryEnabled: true,
            maxRetries: 3,
            retryDelay: 1000,
            memoryMonitoringEnabled: true,
            memoryThreshold: 80,
        };
    }
}
exports.SecureAxiosFactory = SecureAxiosFactory;
exports.secureAxiosFactory = SecureAxiosFactory;
//# sourceMappingURL=axios-security.js.map