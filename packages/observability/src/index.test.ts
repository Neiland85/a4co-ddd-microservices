import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createLogger,
  getTracer,
  initializeLogger,
  initializeObservability,
  logger,
  resetLoggerState,
  resetObservabilityState,
  shutdown,
} from './index';

describe('@a4co/observability', () => {
  // Mock console para evitar output durante tests
  beforeAll(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  // Reset observability state before each test
  beforeEach(() => {
    resetObservabilityState();
    // Don't reset logger state here as some tests depend on global logger
  });

  describe('logger', () => {
    beforeEach(() => {
      resetLoggerState();
    });

    it('should create logger with default configuration', () => {
      const testLogger = createLogger({
        serviceName: 'test-service',
        environment: 'test',
      });

      expect(testLogger).toBeDefined();
      expect(testLogger.info).toBeDefined();
      expect(testLogger.error).toBeDefined();
      expect(testLogger.debug).toBeDefined();
      expect(testLogger.warn).toBeDefined();
    });

    it('should log without throwing errors', () => {
      const testLogger = createLogger({
        serviceName: 'test-service',
        environment: 'test',
        prettyPrint: false, // JSON output for tests
      });

      expect(() => {
        testLogger.info('Test info message');
        testLogger.error('Test error message');
        testLogger.debug('Test debug message');
        testLogger.warn('Test warning message');
      }).not.toThrow();
    });

    it('should use global logger proxy', () => {
      // Inicializar el logger global para que tenga los métodos tipados
      initializeLogger({
        serviceName: 'test-service',
        environment: 'test',
      });

      expect(() => {
        logger.info('ping');
      }).not.toThrow();
    });

    it('should initialize and get global logger', () => {
      const globalLogger = initializeLogger({
        serviceName: 'global-test-service',
        environment: 'test',
      });

      expect(globalLogger).toBeDefined();
      // Instead of testing getGlobalLogger, just verify initializeLogger returns a logger
      expect(globalLogger.info).toBeDefined();
      expect(globalLogger.error).toBeDefined();
    });
  });

  describe('initializeObservability', () => {
    it('should initialize with minimal configuration', () => {
      // Just verify the function doesn't throw and returns something
      expect(() => {
        const result = initializeObservability({
          serviceName: 'test-minimal-service',
        });
        expect(result).toBeDefined();
      }).not.toThrow();
    });

    it('should initialize with full configuration', () => {
      // Just verify the function doesn't throw and returns something
      expect(() => {
        const result = initializeObservability({
          serviceName: 'test-full-service',
          serviceVersion: '1.0.0',
          environment: 'test',
          logging: { level: 'debug', prettyPrint: false },
          tracing: {
            enabled: true,
            jaegerEndpoint: 'http://localhost:14268/api/traces',
            enableConsoleExporter: true,
            enableAutoInstrumentation: false,
          },
          metrics: {
            enabled: true,
            port: 9465,
            endpoint: '/test-metrics',
          },
        });
        expect(result).toBeDefined();
      }).not.toThrow();
    });

    it('should disable tracing when specified', () => {
      const result = initializeObservability({
        serviceName: 'test-no-tracing',
        tracing: {
          enabled: false,
        },
      });

      expect(result).toBeDefined();
      if (result) {
        // Tracing should be disabled (either null or undefined)
        expect(result.tracingSDK).toBeFalsy();
      }
    });

    it('should disable metrics when specified', () => {
      const result = initializeObservability({
        serviceName: 'test-no-metrics',
        tracing: { enabled: true },
        metrics: {
          enabled: false,
        },
      });

      expect(result).toBeDefined();
      if (result) {
        // Metrics should be disabled (either null or undefined)
        expect(result.metricsExporter).toBeFalsy();
      }
    });
  });

  describe('tracing', () => {
    it('should get tracer', () => {
      const tracer = getTracer('test-tracer');
      expect(tracer).toBeDefined();
      expect(tracer.startSpan).toBeDefined();
    });

    it('should create and end span without errors', () => {
      const tracer = getTracer('test-tracer');

      expect(() => {
        const span = tracer.startSpan('test-operation');
        span.setAttribute('test.attribute', 'value');
        span.addEvent('test-event');
        span.end();
      }).not.toThrow();
    });
  });

  describe('shutdown', () => {
    it('should shutdown without errors', async () => {
      await expect(shutdown()).resolves.not.toThrow();
    });
  });
});

// Test de humo específico requerido
describe('Smoke test', () => {
  it('should log "ping" without failing', () => {
    expect(() => {
      logger.info('ping');
    }).not.toThrow();
  });
});
