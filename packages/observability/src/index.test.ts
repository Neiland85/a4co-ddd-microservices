import { createLogger, createHttpLogger, getTracer } from '../src/index';

describe('@a4co/observability', () => {
  describe('createLogger', () => {
    it('should create a logger instance', () => {
      const logger = createLogger();
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
    });

    it('should accept logger options', () => {
      const logger = createLogger({ level: 'debug' });
      expect(logger).toBeDefined();
    });
  });

  describe('createHttpLogger', () => {
    it('should create a pino-http middleware', () => {
      const httpLogger = createHttpLogger();
      expect(httpLogger).toBeDefined();
      expect(typeof httpLogger).toBe('function');
    });
  });

  describe('getTracer', () => {
    it('should return an OpenTelemetry tracer', () => {
      const tracer = getTracer();
      expect(tracer).toBeDefined();
      expect(typeof tracer.startSpan).toBe('function');
    });

    it('should accept a custom name', () => {
      const tracer = getTracer('custom-tracer');
      expect(tracer).toBeDefined();
    });
  });
});