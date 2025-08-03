"use strict";
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
var vitest_1 = require("vitest");
var index_1 = require("./index");
(0, vitest_1.describe)('@a4co/observability', function () {
    // Mock console para evitar output durante tests
    (0, vitest_1.beforeAll)(function () {
        vitest_1.vi.spyOn(console, 'log').mockImplementation(function () { });
        vitest_1.vi.spyOn(console, 'error').mockImplementation(function () { });
    });
    (0, vitest_1.afterAll)(function () {
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.describe)('logger', function () {
        (0, vitest_1.it)('should create logger with default configuration', function () {
            var testLogger = (0, index_1.createLogger)({
                serviceName: 'test-service',
                environment: 'test'
            });
            (0, vitest_1.expect)(testLogger).toBeDefined();
            (0, vitest_1.expect)(testLogger.info).toBeDefined();
            (0, vitest_1.expect)(testLogger.error).toBeDefined();
            (0, vitest_1.expect)(testLogger.debug).toBeDefined();
            (0, vitest_1.expect)(testLogger.warn).toBeDefined();
        });
        (0, vitest_1.it)('should log without throwing errors', function () {
            var testLogger = (0, index_1.createLogger)({
                serviceName: 'test-service',
                environment: 'test',
                prettyPrint: false // JSON output for tests
            });
            (0, vitest_1.expect)(function () {
                testLogger.info('Test info message');
                testLogger.error('Test error message');
                testLogger.debug('Test debug message');
                testLogger.warn('Test warning message');
            }).not.toThrow();
        });
        (0, vitest_1.it)('should use global logger proxy', function () {
            (0, vitest_1.expect)(function () {
                index_1.logger.info('ping');
            }).not.toThrow();
        });
        (0, vitest_1.it)('should initialize and get global logger', function () {
            var globalLogger = (0, index_1.initializeLogger)({
                serviceName: 'global-test-service',
                environment: 'test'
            });
            (0, vitest_1.expect)(globalLogger).toBeDefined();
            (0, vitest_1.expect)((0, index_1.getGlobalLogger)()).toBe(globalLogger);
        });
    });
    (0, vitest_1.describe)('initializeObservability', function () {
        (0, vitest_1.it)('should initialize with minimal configuration', function () {
            var result = (0, index_1.initializeObservability)({
                serviceName: 'test-minimal-service'
            });
            (0, vitest_1.expect)(result).toBeDefined();
            (0, vitest_1.expect)(result.logger).toBeDefined();
            (0, vitest_1.expect)(result.httpLogger).toBeDefined();
            (0, vitest_1.expect)(result.getTracer).toBeDefined();
            (0, vitest_1.expect)(result.shutdown).toBeDefined();
        });
        (0, vitest_1.it)('should initialize with full configuration', function () {
            var result = (0, index_1.initializeObservability)({
                serviceName: 'test-full-service',
                serviceVersion: '1.0.0',
                environment: 'test',
                logging: {
                    level: 'debug',
                    prettyPrint: false
                },
                tracing: {
                    enabled: true,
                    enableConsoleExporter: true,
                    enableAutoInstrumentation: false
                },
                metrics: {
                    enabled: true,
                    port: 9465,
                    endpoint: '/test-metrics'
                }
            });
            (0, vitest_1.expect)(result).toBeDefined();
            (0, vitest_1.expect)(result.logger).toBeDefined();
            (0, vitest_1.expect)(result.tracingSDK).toBeDefined();
            (0, vitest_1.expect)(result.metricsExporter).toBeDefined();
        });
        (0, vitest_1.it)('should disable tracing when specified', function () {
            var result = (0, index_1.initializeObservability)({
                serviceName: 'test-no-tracing',
                tracing: {
                    enabled: false
                }
            });
            (0, vitest_1.expect)(result.tracingSDK).toBeNull();
        });
        (0, vitest_1.it)('should disable metrics when specified', function () {
            var result = (0, index_1.initializeObservability)({
                serviceName: 'test-no-metrics',
                metrics: {
                    enabled: false
                }
            });
            (0, vitest_1.expect)(result.metricsExporter).toBeNull();
        });
    });
    (0, vitest_1.describe)('tracing', function () {
        (0, vitest_1.it)('should get tracer', function () {
            var tracer = (0, index_1.getTracer)('test-tracer');
            (0, vitest_1.expect)(tracer).toBeDefined();
            (0, vitest_1.expect)(tracer.startSpan).toBeDefined();
        });
        (0, vitest_1.it)('should create and end span without errors', function () {
            var tracer = (0, index_1.getTracer)('test-tracer');
            (0, vitest_1.expect)(function () {
                var span = tracer.startSpan('test-operation');
                span.setAttribute('test.attribute', 'value');
                span.addEvent('test-event');
                span.end();
            }).not.toThrow();
        });
    });
    (0, vitest_1.describe)('shutdown', function () {
        (0, vitest_1.it)('should shutdown without errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, index_1.shutdown)()).resolves.not.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
// Test de humo específico requerido
(0, vitest_1.describe)('Smoke test', function () {
    (0, vitest_1.it)('should log "ping" without failing', function () {
        (0, vitest_1.expect)(function () {
            index_1.logger.info('ping');
        }).not.toThrow();
    });
});
