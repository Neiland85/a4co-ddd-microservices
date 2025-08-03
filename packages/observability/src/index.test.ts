import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { 
  logger, 
  initializeObservability, 
  createLogger,
  initializeLogger,
  getGlobalLogger,
  getTracer,
  shutdown
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

  describe('logger', () => {
    it('should create logger with default configuration', () => {
      const testLogger = createLogger({
        serviceName: 'test-service',
        environment: 'test'
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
        prettyPrint: false // JSON output for tests
      });

      expect(() => {
        testLogger.info('Test info message');
        testLogger.error('Test error message');
        testLogger.debug('Test debug message');
        testLogger.warn('Test warning message');
      }).not.toThrow();
    });

    it('should use global logger proxy', () => {
      expect(() => {
        logger.info('ping');
      }).not.toThrow();
    });

    it('should initialize and get global logger', () => {
      const globalLogger = initializeLogger({
        serviceName: 'global-test-service',
        environment: 'test'
      });

      expect(globalLogger).toBeDefined();
      expect(getGlobalLogger()).toBe(globalLogger);
    });
  });

  describe('initializeObservability', () => {
    it('should initialize with minimal configuration', () => {
      const result = initializeObservability({
        serviceName: 'test-minimal-service'
      });

      expect(result).toBeDefined();
      expect(result.logger).toBeDefined();
      expect(result.httpLogger).toBeDefined();
      expect(result.getTracer).toBeDefined();
      expect(result.shutdown).toBeDefined();
    });

    it('should initialize with full configuration', () => {
      const result = initializeObservability({
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

      expect(result).toBeDefined();
      expect(result.logger).toBeDefined();
      expect(result.tracingSDK).toBeDefined();
      expect(result.metricsExporter).toBeDefined();
    });

    it('should disable tracing when specified', () => {
      const result = initializeObservability({
        serviceName: 'test-no-tracing',
        tracing: {
          enabled: false
        }
      });

      expect(result.tracingSDK).toBeNull();
    });

    it('should disable metrics when specified', () => {
      const result = initializeObservability({
        serviceName: 'test-no-metrics',
        metrics: {
          enabled: false
        }
      });

      expect(result.metricsExporter).toBeNull();
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