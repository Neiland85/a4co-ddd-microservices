"use strict";
/**
 * Frontend logger implementation for React applications
 */
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
exports.FrontendLogger = void 0;
exports.createFrontendLogger = createFrontendLogger;
var FrontendLogger = /** @class */ (function () {
    function FrontendLogger(config) {
        this.buffer = [];
        this.config = __assign({ level: 'info', bufferSize: 100, flushInterval: 5000, enableConsole: true, enableRemote: true }, config);
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
    FrontendLogger.prototype.startFlushTimer = function () {
        var _this = this;
        this.flushTimer = setInterval(function () {
            _this.flush();
        }, this.config.flushInterval);
    };
    FrontendLogger.prototype.handleWindowError = function (event) {
        this.error('Unhandled error', event.error, {
            custom: {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
            },
        });
    };
    FrontendLogger.prototype.handleUnhandledRejection = function (event) {
        this.error('Unhandled promise rejection', event.reason);
    };
    FrontendLogger.prototype.shouldLog = function (level) {
        var levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
        var configLevelIndex = levels.indexOf(this.config.level || 'info');
        var messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex >= configLevelIndex;
    };
    FrontendLogger.prototype.log = function (level, message, context) {
        if (!this.shouldLog(level)) {
            return;
        }
        var entry = {
            level: level,
            message: message,
            context: __assign(__assign(__assign({}, this.baseContext), context), { custom: __assign(__assign({}, context === null || context === void 0 ? void 0 : context.custom), { userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined, url: typeof window !== 'undefined' ? window.location.href : undefined }) }),
            timestamp: new Date().toISOString(),
        };
        if (this.config.enableConsole) {
            this.logToConsole(entry);
        }
        if (this.config.enableRemote) {
            this.addToBuffer(entry);
        }
    };
    FrontendLogger.prototype.logToConsole = function (entry) {
        var consoleMethods = {
            trace: console.trace,
            debug: console.debug,
            info: console.info,
            warn: console.warn,
            error: console.error,
            fatal: console.error,
        };
        var method = consoleMethods[entry.level] || console.log;
        method("[".concat(entry.level.toUpperCase(), "] ").concat(entry.message), entry.context);
    };
    FrontendLogger.prototype.addToBuffer = function (entry) {
        this.buffer.push(entry);
        if (this.buffer.length >= (this.config.bufferSize || 100)) {
            this.flush();
        }
    };
    FrontendLogger.prototype.flush = function () {
        return __awaiter(this, void 0, void 0, function () {
            var logsToSend, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.buffer.length === 0 || !this.config.endpoint) {
                            return [2 /*return*/];
                        }
                        logsToSend = __spreadArray([], this.buffer, true);
                        this.buffer = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch(this.config.endpoint, {
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
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        // Re-add logs to buffer if send fails
                        this.buffer = __spreadArray(__spreadArray([], logsToSend, true), this.buffer, true);
                        console.error('Failed to send logs to server:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FrontendLogger.prototype.trace = function (message, context) {
        this.log('trace', message, context);
    };
    FrontendLogger.prototype.debug = function (message, context) {
        this.log('debug', message, context);
    };
    FrontendLogger.prototype.info = function (message, context) {
        this.log('info', message, context);
    };
    FrontendLogger.prototype.warn = function (message, context) {
        this.log('warn', message, context);
    };
    FrontendLogger.prototype.error = function (message, error, context) {
        var errorContext = error instanceof Error
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
        this.log('error', message, __assign(__assign({}, context), errorContext));
    };
    FrontendLogger.prototype.fatal = function (message, error, context) {
        var errorContext = error instanceof Error
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
        this.log('fatal', message, __assign(__assign({}, context), errorContext));
    };
    FrontendLogger.prototype.child = function (context) {
        var childLogger = new FrontendLogger(this.config);
        childLogger.baseContext = __assign(__assign({}, this.baseContext), context);
        return childLogger;
    };
    FrontendLogger.prototype.destroy = function () {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        this.flush();
    };
    return FrontendLogger;
}());
exports.FrontendLogger = FrontendLogger;
/**
 * Factory function to create a frontend logger instance
 */
function createFrontendLogger(config) {
    return new FrontendLogger(config);
}
