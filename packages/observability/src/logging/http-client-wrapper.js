"use strict";
/**
 * HTTP client wrapper with automatic logging and tracing
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchWrapperWithInterceptors = exports.InterceptorManager = exports.FetchWrapper = void 0;
exports.createFetchWrapper = createFetchWrapper;
const uuid_1 = require("uuid");
/**
 * Enhanced fetch wrapper with logging and tracing
 */
class FetchWrapper {
    config;
    constructor(config) {
        this.config = config;
    }
    generateTraceHeaders(traceId, spanId) {
        const headers = {};
        if (this.config.propagateTrace) {
            headers['X-Trace-Id'] = traceId || (0, uuid_1.v4)();
            headers['X-Span-Id'] = spanId || (0, uuid_1.v4)();
            headers['X-Parent-Span-Id'] = spanId || '';
        }
        return headers;
    }
    getFullUrl(url) {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return this.config.baseURL ? `${this.config.baseURL}${url}` : url;
    }
    async request(url, config) {
        const fullUrl = this.getFullUrl(url);
        const traceId = config?.traceId || (0, uuid_1.v4)();
        const spanId = config?.spanId || (0, uuid_1.v4)();
        const logger = config?.logger || this.config.logger;
        const startTime = Date.now();
        const headers = {
            ...this.config.defaultHeaders,
            ...config?.headers,
            ...this.generateTraceHeaders(traceId, spanId),
        };
        logger.info('HTTP request started', {
            traceId,
            spanId,
            http: {
                method: config?.method || 'GET',
                url: fullUrl,
            },
            custom: {
                hasBody: !!config?.body,
            },
        });
        try {
            const response = await fetch(fullUrl, {
                ...config,
                headers,
            });
            const duration = Date.now() - startTime;
            logger.info('HTTP request completed', {
                traceId,
                spanId,
                http: {
                    method: config?.method || 'GET',
                    url: fullUrl,
                    statusCode: response.status,
                    duration,
                },
            });
            return response;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            logger.error('HTTP request failed', error, {
                traceId,
                spanId,
                http: {
                    method: config?.method || 'GET',
                    url: fullUrl,
                    duration,
                },
            });
            throw error;
        }
    }
    async get(url, config) {
        return this.request(url, { ...config, method: 'GET' });
    }
    async post(url, body, config) {
        return this.request(url, {
            ...config,
            method: 'POST',
            body: typeof body === 'string' ? body : JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
        });
    }
    async put(url, body, config) {
        return this.request(url, {
            ...config,
            method: 'PUT',
            body: typeof body === 'string' ? body : JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
        });
    }
    async patch(url, body, config) {
        return this.request(url, {
            ...config,
            method: 'PATCH',
            body: typeof body === 'string' ? body : JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
        });
    }
    async delete(url, config) {
        return this.request(url, { ...config, method: 'DELETE' });
    }
}
exports.FetchWrapper = FetchWrapper;
/**
 * Factory function to create a fetch wrapper instance
 */
function createFetchWrapper(config) {
    return new FetchWrapper(config);
}
class InterceptorManager {
    handlers = [];
    use(onFulfilled, onRejected) {
        this.handlers.push({
            onFulfilled,
            onRejected,
        });
        return this.handlers.length - 1;
    }
    eject(id) {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    }
    forEach(fn) {
        this.handlers.forEach(handler => {
            if (handler !== null) {
                fn(handler);
            }
        });
    }
}
exports.InterceptorManager = InterceptorManager;
/**
 * Enhanced fetch wrapper with interceptors
 */
class FetchWrapperWithInterceptors extends FetchWrapper {
    interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager(),
    };
    async request(url, config) {
        let finalConfig = config || {};
        // Apply request interceptors
        const requestInterceptorChain = [];
        this.interceptors.request.forEach(interceptor => {
            if (interceptor.onFulfilled) {
                requestInterceptorChain.push(interceptor.onFulfilled);
            }
        });
        for (const interceptor of requestInterceptorChain) {
            try {
                finalConfig = await interceptor(finalConfig);
            }
            catch (error) {
                throw error;
            }
        }
        try {
            let response = await super.request(url, finalConfig);
            // Apply response interceptors
            const responseInterceptorChain = [];
            this.interceptors.response.forEach(interceptor => {
                if (interceptor.onFulfilled) {
                    responseInterceptorChain.push(interceptor.onFulfilled);
                }
            });
            for (const interceptor of responseInterceptorChain) {
                response = await interceptor(response);
            }
            return response;
        }
        catch (error) {
            // Apply error interceptors
            let finalError = error;
            this.interceptors.response.forEach(interceptor => {
                if (interceptor.onRejected) {
                    finalError = interceptor.onRejected(finalError);
                }
            });
            throw finalError;
        }
    }
}
exports.FetchWrapperWithInterceptors = FetchWrapperWithInterceptors;
//# sourceMappingURL=http-client-wrapper.js.map