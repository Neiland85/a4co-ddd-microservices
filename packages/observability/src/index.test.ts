import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { createLogger, initializeLogger, resetLoggerState } from './logging';
import { getTracer } from './index';

describe('@a4co/observability', () => {
  beforeAll(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    vi.restoreAllMocks();
      resetLoggerState();
    });

  it('crea un logger básico', () => {
    const logger = createLogger({
        serviceName: 'test-service',
        environment: 'test',
      prettyPrint: false,
    });

    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    });

  it('inicializa el logger global sin errores', () => {
    const logger = initializeLogger({
      serviceName: 'global-test',
        environment: 'test',
          prettyPrint: false,
    });

    expect(logger).toBeDefined();
    expect(() => logger.info('ping')).not.toThrow();
  });

  it('obtiene un tracer operativo', () => {
      const tracer = getTracer('test-tracer');

    expect(tracer).toBeDefined();
    expect(typeof tracer.startSpan).toBe('function');
  });
});
