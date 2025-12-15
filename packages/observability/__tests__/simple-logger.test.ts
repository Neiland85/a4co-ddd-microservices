import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import pino from 'pino';
import { SimpleLogger, createSimpleLogger } from '../src/logger/simple-logger';
import { setTraceContext, clearTraceContext } from '../src/utils/async-context';
import type { LogPayload } from '../src/types/log-payload.types';

describe('SimpleLogger', () => {
  let logger: SimpleLogger;
  let mockPinoLogger: any;

  beforeEach(() => {
    // Mock pino logger
    mockPinoLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
      fatal: vi.fn(),
      child: vi.fn((context) => mockPinoLogger),
    };

    logger = new SimpleLogger(mockPinoLogger);

    // Set test trace context
    setTraceContext({
      traceId: 'test-trace-123',
      spanId: 'test-span-456',
    });
  });

  afterEach(() => {
    clearTraceContext();
    vi.clearAllMocks();
  });

  describe('info method', () => {
    it('should log info with trace context automatically injected', () => {
      const payload: LogPayload = { action: 'TestAction', userId: 'user-1' };
      logger.info(payload, 'Test message');

      expect(mockPinoLogger.info).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'TestAction',
          userId: 'user-1',
          traceId: 'test-trace-123',
          spanId: 'test-span-456',
        }),
        'Test message'
      );
    });

    it('should support message-first signature', () => {
      logger.info('Simple message', { extra: 'data' });

      expect(mockPinoLogger.info).toHaveBeenCalledWith(
        expect.objectContaining({
          extra: 'data',
          traceId: 'test-trace-123',
          spanId: 'test-span-456',
        }),
        'Simple message'
      );
    });

    it('should not override explicit trace context', () => {
      logger.info(
        { traceId: 'explicit-trace', action: 'Override' },
        'Override test'
      );

      expect(mockPinoLogger.info).toHaveBeenCalledWith(
        expect.objectContaining({
          traceId: 'explicit-trace',
          action: 'Override',
        }),
        'Override test'
      );
    });

    it('should work with empty payload', () => {
      logger.info({}, 'Empty payload message');

      expect(mockPinoLogger.info).toHaveBeenCalledWith(
        expect.objectContaining({
          traceId: 'test-trace-123',
          spanId: 'test-span-456',
        }),
        'Empty payload message'
      );
    });
  });

  describe('warn method', () => {
    it('should log warning with trace context', () => {
      logger.warn({ alert: 'slowQuery' }, 'Query exceeded threshold');

      expect(mockPinoLogger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          alert: 'slowQuery',
          traceId: 'test-trace-123',
          spanId: 'test-span-456',
        }),
        'Query exceeded threshold'
      );
    });
  });

  describe('error method', () => {
    it('should log error with trace context', () => {
      logger.error({ errorCode: 'E001' }, 'Something went wrong');

      expect(mockPinoLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          errorCode: 'E001',
          traceId: 'test-trace-123',
          spanId: 'test-span-456',
        }),
        'Something went wrong'
      );
    });

    it('should handle Error object as first parameter', () => {
      const error = new Error('Test error');
      logger.error(error);

      expect(mockPinoLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          traceId: 'test-trace-123',
          spanId: 'test-span-456',
          error: {
            message: 'Test error',
            name: 'Error',
            stack: expect.stringContaining('Error: Test error'),
          },
        }),
        'Test error'
      );
    });

    it('should handle Error object as second parameter with payload', () => {
      const error = new Error('Database connection failed');
      logger.error({ service: 'database' }, error);

      expect(mockPinoLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          service: 'database',
          traceId: 'test-trace-123',
          spanId: 'test-span-456',
          error: {
            message: 'Database connection failed',
            name: 'Error',
            stack: expect.any(String),
          },
        }),
        'Database connection failed'
      );
    });

    it('should handle custom error properties', () => {
      const error: any = new Error('Custom error');
      error.code = 'CUSTOM_CODE';
      error.statusCode = 500;

      logger.error(error);

      expect(mockPinoLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Custom error',
            name: 'Error',
          }),
        }),
        'Custom error'
      );
    });
  });

  describe('debug method', () => {
    it('should log debug with trace context', () => {
      logger.debug({ query: 'SELECT * FROM users' }, 'Executing query');

      expect(mockPinoLogger.debug).toHaveBeenCalledWith(
        expect.objectContaining({
          query: 'SELECT * FROM users',
          traceId: 'test-trace-123',
          spanId: 'test-span-456',
        }),
        'Executing query'
      );
    });
  });

  describe('fatal method', () => {
    it('should log fatal with trace context', () => {
      logger.fatal({ critical: true }, 'System shutdown');

      expect(mockPinoLogger.fatal).toHaveBeenCalledWith(
        expect.objectContaining({
          critical: true,
          traceId: 'test-trace-123',
          spanId: 'test-span-456',
        }),
        'System shutdown'
      );
    });
  });

  describe('child logger', () => {
    it('should create child logger with additional context', () => {
      const childLogger = logger.child({ module: 'auth' });

      expect(mockPinoLogger.child).toHaveBeenCalledWith({ module: 'auth' });
      expect(childLogger).toBeInstanceOf(SimpleLogger);
    });

    it('should inherit trace context in child logger', () => {
      const childLogger = logger.child({ module: 'auth' });
      childLogger.info({ action: 'login' }, 'User logged in');

      expect(mockPinoLogger.info).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'login',
          traceId: 'test-trace-123',
          spanId: 'test-span-456',
        }),
        'User logged in'
      );
    });
  });

  describe('raw property', () => {
    it('should expose underlying pino logger', () => {
      expect(logger.raw).toBe(mockPinoLogger);
    });
  });

  describe('createSimpleLogger', () => {
    it('should create logger with development config', () => {
      const devLogger = createSimpleLogger({
        serviceName: 'test-service',
        environment: 'development',
      });

      expect(devLogger).toBeInstanceOf(SimpleLogger);
      expect(devLogger.raw).toBeDefined();
    });

    it('should create logger with production config', () => {
      const prodLogger = createSimpleLogger({
        serviceName: 'test-service',
        environment: 'production',
        prettyPrint: false,
      });

      expect(prodLogger).toBeInstanceOf(SimpleLogger);
      expect(prodLogger.raw).toBeDefined();
    });

    it('should respect custom log level', () => {
      const logger = createSimpleLogger({
        serviceName: 'test-service',
        environment: 'development',
        level: 'warn',
      });

      expect(logger.raw.level).toBe('warn');
    });

    it('should default to info level in production', () => {
      const logger = createSimpleLogger({
        serviceName: 'test-service',
        environment: 'production',
      });

      expect(logger.raw.level).toBe('info');
    });

    it('should default to debug level in development', () => {
      const logger = createSimpleLogger({
        serviceName: 'test-service',
        environment: 'development',
        prettyPrint: false,
      });

      expect(logger.raw.level).toBe('debug');
    });
  });

  describe('Trace context scenarios', () => {
    it('should use unknown values when no context is set', () => {
      clearTraceContext();
      logger.info({ test: 'data' }, 'No context');

      expect(mockPinoLogger.info).toHaveBeenCalledWith(
        expect.objectContaining({
          traceId: 'unknown',
          spanId: 'unknown',
        }),
        'No context'
      );
    });

    it('should update trace context dynamically', () => {
      logger.info({ step: 1 }, 'First log');

      setTraceContext({
        traceId: 'new-trace-789',
        spanId: 'new-span-012',
      });

      logger.info({ step: 2 }, 'Second log');

      expect(mockPinoLogger.info).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ traceId: 'test-trace-123' }),
        'First log'
      );

      expect(mockPinoLogger.info).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ traceId: 'new-trace-789' }),
        'Second log'
      );
    });
  });
});
