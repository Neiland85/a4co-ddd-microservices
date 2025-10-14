"use strict";
/**
 * Frontend logger implementation for React applications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrontendLogger = void 0;
exports.createFrontendLogger = createFrontendLogger;
class FrontendLogger {
    buffer = [];
    config;
    baseContext;
    flushTimer;
    constructor(config) {
        this.config = {
            level: 'info',
            bufferSize: 100,
            flushInterval: 5000,
            enableConsole: true,
            enableRemote: true,
            ...config,
        };
        this.baseContext = {
            service: config.service,
            environment: config.environment,
            version: config.version,
        };
        if (this.config.enableRemote && this.config.flushInterval) {
            this.startFlushTimer();
        }
        // Attach to window error events
        if (typeof window !== 'undefined') {
            window.addEventListener('error', this.handleWindowError.bind(this));
            window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
        }
    }
    startFlushTimer() {
        this.flushTimer = setInterval(() => {
            this.flush();
        }, this.config.flushInterval);
    }
    handleWindowError(event) {
        this.error('Unhandled error', event.error, {
            custom: {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
            },
        });
    }
    handleUnhandledRejection(event) {
        this.error('Unhandled promise rejection', event.reason);
    }
    shouldLog(level) {
        const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
        const configLevelIndex = levels.indexOf(this.config.level || 'info');
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex >= configLevelIndex;
    }
    log(level, message, context) {
        if (!this.shouldLog(level)) {
            return;
        }
        const entry = {
            level,
            message,
            context: {
                ...this.baseContext,
                ...context,
                custom: {
                    ...context?.custom,
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                },
            },
            timestamp: new Date().toISOString(),
        };
        if (this.config.enableConsole) {
            this.logToConsole(entry);
        }
        if (this.config.enableRemote) {
            this.addToBuffer(entry);
        }
    }
    logToConsole(entry) {
        const consoleMethods = {
            trace: console.trace,
            debug: console.debug,
            info: console.info,
            warn: console.warn,
            error: console.error,
            fatal: console.error,
        };
        const method = consoleMethods[entry.level] || console.log;
        method(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.context);
    }
    addToBuffer(entry) {
        this.buffer.push(entry);
        if (this.buffer.length >= (this.config.bufferSize || 100)) {
            this.flush();
        }
    }
    async flush() {
        if (this.buffer.length === 0 || !this.config.endpoint) {
            return;
        }
        const logsToSend = [...this.buffer];
        this.buffer = [];
        try {
            await fetch(this.config.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    logs: logsToSend,
                    metadata: {
                        service: this.config.service,
                        environment: this.config.environment,
                        version: this.config.version,
                    },
                }),
            });
        }
        catch (error) {
            // Re-add logs to buffer if send fails
            this.buffer = [...logsToSend, ...this.buffer];
            console.error('Failed to send logs to server:', error);
        }
    }
    trace(message, context) {
        this.log('trace', message, context);
    }
    debug(message, context) {
        this.log('debug', message, context);
    }
    info(message, context) {
        this.log('info', message, context);
    }
    warn(message, context) {
        this.log('warn', message, context);
    }
    error(message, error, context) {
        const errorContext = error instanceof Error
            ? {
                error: {
                    message: error.message,
                    stackTrace: error.stack,
                    name: error.name,
                },
            }
            : error
                ? { error: String(error) }
                : {};
        this.log('error', message, {
            ...context,
            ...errorContext,
        });
    }
    fatal(message, error, context) {
        const errorContext = error instanceof Error
            ? {
                error: {
                    message: error.message,
                    stackTrace: error.stack,
                    name: error.name,
                },
            }
            : error
                ? { error: String(error) }
                : {};
        this.log('fatal', message, {
            ...context,
            ...errorContext,
        });
    }
    child(context) {
        const childLogger = new FrontendLogger(this.config);
        childLogger.baseContext = { ...this.baseContext, ...context };
        return childLogger;
    }
    destroy() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        this.flush();
    }
}
exports.FrontendLogger = FrontendLogger;
/**
 * Factory function to create a frontend logger instance
 */
function createFrontendLogger(config) {
    return new FrontendLogger(config);
}
//# sourceMappingURL=frontend-logger.js.map