"use strict";
/**
 * HTTP client wrapper with automatic logging and tracing
 */
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
exports.FetchWrapperWithInterceptors = exports.InterceptorManager = exports.FetchWrapper = void 0;
exports.createFetchWrapper = createFetchWrapper;
var uuid_1 = require("uuid");
/**
 * Enhanced fetch wrapper with logging and tracing
 */
var FetchWrapper = /** @class */ (function () {
    function FetchWrapper(config) {
        this.config = config;
    }
    FetchWrapper.prototype.generateTraceHeaders = function (traceId, spanId) {
        var headers = {};
        if (this.config.propagateTrace) {
            headers['X-Trace-Id'] = traceId || (0, uuid_1.v4)();
            headers['X-Span-Id'] = spanId || (0, uuid_1.v4)();
            headers['X-Parent-Span-Id'] = spanId || '';
        }
        return headers;
    };
    FetchWrapper.prototype.getFullUrl = function (url) {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return this.config.baseURL ? "".concat(this.config.baseURL).concat(url) : url;
    };
    FetchWrapper.prototype.request = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            var fullUrl, traceId, spanId, logger, startTime, headers, response, duration, error_1, duration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullUrl = this.getFullUrl(url);
                        traceId = (config === null || config === void 0 ? void 0 : config.traceId) || (0, uuid_1.v4)();
                        spanId = (config === null || config === void 0 ? void 0 : config.spanId) || (0, uuid_1.v4)();
                        logger = (config === null || config === void 0 ? void 0 : config.logger) || this.config.logger;
                        startTime = Date.now();
                        headers = __assign(__assign(__assign({}, this.config.defaultHeaders), config === null || config === void 0 ? void 0 : config.headers), this.generateTraceHeaders(traceId, spanId));
                        logger.info('HTTP request started', {
                            traceId: traceId,
                            spanId: spanId,
                            http: {
                                method: (config === null || config === void 0 ? void 0 : config.method) || 'GET',
                                url: fullUrl,
                            },
                            custom: {
                                hasBody: !!(config === null || config === void 0 ? void 0 : config.body),
                            },
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch(fullUrl, __assign(__assign({}, config), { headers: headers }))];
                    case 2:
                        response = _a.sent();
                        duration = Date.now() - startTime;
                        logger.info('HTTP request completed', {
                            traceId: traceId,
                            spanId: spanId,
                            http: {
                                method: (config === null || config === void 0 ? void 0 : config.method) || 'GET',
                                url: fullUrl,
                                statusCode: response.status,
                                duration: duration,
                            },
                        });
                        return [2 /*return*/, response];
                    case 3:
                        error_1 = _a.sent();
                        duration = Date.now() - startTime;
                        logger.error('HTTP request failed', error_1, {
                            traceId: traceId,
                            spanId: spanId,
                            http: {
                                method: (config === null || config === void 0 ? void 0 : config.method) || 'GET',
                                url: fullUrl,
                                duration: duration,
                            },
                        });
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FetchWrapper.prototype.get = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request(url, __assign(__assign({}, config), { method: 'GET' }))];
            });
        });
    };
    FetchWrapper.prototype.post = function (url, body, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request(url, __assign(__assign({}, config), { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body), headers: __assign({ 'Content-Type': 'application/json' }, config === null || config === void 0 ? void 0 : config.headers) }))];
            });
        });
    };
    FetchWrapper.prototype.put = function (url, body, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request(url, __assign(__assign({}, config), { method: 'PUT', body: typeof body === 'string' ? body : JSON.stringify(body), headers: __assign({ 'Content-Type': 'application/json' }, config === null || config === void 0 ? void 0 : config.headers) }))];
            });
        });
    };
    FetchWrapper.prototype.patch = function (url, body, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request(url, __assign(__assign({}, config), { method: 'PATCH', body: typeof body === 'string' ? body : JSON.stringify(body), headers: __assign({ 'Content-Type': 'application/json' }, config === null || config === void 0 ? void 0 : config.headers) }))];
            });
        });
    };
    FetchWrapper.prototype.delete = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request(url, __assign(__assign({}, config), { method: 'DELETE' }))];
            });
        });
    };
    return FetchWrapper;
}());
exports.FetchWrapper = FetchWrapper;
/**
 * Factory function to create a fetch wrapper instance
 */
function createFetchWrapper(config) {
    return new FetchWrapper(config);
}
var InterceptorManager = /** @class */ (function () {
    function InterceptorManager() {
        this.handlers = [];
    }
    InterceptorManager.prototype.use = function (onFulfilled, onRejected) {
        this.handlers.push({
            onFulfilled: onFulfilled,
            onRejected: onRejected,
        });
        return this.handlers.length - 1;
    };
    InterceptorManager.prototype.eject = function (id) {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    };
    InterceptorManager.prototype.forEach = function (fn) {
        this.handlers.forEach(function (handler) {
            if (handler !== null) {
                fn(handler);
            }
        });
    };
    return InterceptorManager;
}());
exports.InterceptorManager = InterceptorManager;
/**
 * Enhanced fetch wrapper with interceptors
 */
var FetchWrapperWithInterceptors = /** @class */ (function (_super) {
    __extends(FetchWrapperWithInterceptors, _super);
    function FetchWrapperWithInterceptors() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager(),
        };
        return _this;
    }
    FetchWrapperWithInterceptors.prototype.request = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            var finalConfig, requestInterceptorChain, _i, requestInterceptorChain_1, interceptor, error_2, response, responseInterceptorChain_2, _a, responseInterceptorChain_1, interceptor, error_3, finalError_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        finalConfig = config || {};
                        requestInterceptorChain = [];
                        this.interceptors.request.forEach(function (interceptor) {
                            if (interceptor.onFulfilled) {
                                requestInterceptorChain.push(interceptor.onFulfilled);
                            }
                        });
                        _i = 0, requestInterceptorChain_1 = requestInterceptorChain;
                        _b.label = 1;
                    case 1:
                        if (!(_i < requestInterceptorChain_1.length)) return [3 /*break*/, 6];
                        interceptor = requestInterceptorChain_1[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, interceptor(finalConfig)];
                    case 3:
                        finalConfig = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        throw error_2;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        _b.trys.push([6, 12, , 13]);
                        return [4 /*yield*/, _super.prototype.request.call(this, url, finalConfig)];
                    case 7:
                        response = _b.sent();
                        responseInterceptorChain_2 = [];
                        this.interceptors.response.forEach(function (interceptor) {
                            if (interceptor.onFulfilled) {
                                responseInterceptorChain_2.push(interceptor.onFulfilled);
                            }
                        });
                        _a = 0, responseInterceptorChain_1 = responseInterceptorChain_2;
                        _b.label = 8;
                    case 8:
                        if (!(_a < responseInterceptorChain_1.length)) return [3 /*break*/, 11];
                        interceptor = responseInterceptorChain_1[_a];
                        return [4 /*yield*/, interceptor(response)];
                    case 9:
                        response = _b.sent();
                        _b.label = 10;
                    case 10:
                        _a++;
                        return [3 /*break*/, 8];
                    case 11: return [2 /*return*/, response];
                    case 12:
                        error_3 = _b.sent();
                        finalError_1 = error_3;
                        this.interceptors.response.forEach(function (interceptor) {
                            if (interceptor.onRejected) {
                                finalError_1 = interceptor.onRejected(finalError_1);
                            }
                        });
                        throw finalError_1;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    return FetchWrapperWithInterceptors;
}(FetchWrapper));
exports.FetchWrapperWithInterceptors = FetchWrapperWithInterceptors;
