import { describe, it, expect, beforeEach } from 'vitest';
import {
  setTraceContext,
  getTraceContext,
  runInTraceContext,
  runInTraceContextAsync,
  clearTraceContext,
  type TraceContext,
} from '../src/utils/async-context';

describe('AsyncLocalStorage Trace Context', () => {
  beforeEach(() => {
    clearTraceContext();
  });

  describe('setTraceContext and getTraceContext', () => {
    it('should set and retrieve trace context', () => {
      const context: TraceContext = {
        traceId: 'test-trace-123',
        spanId: 'test-span-456',
      };

      setTraceContext(context);
      const retrieved = getTraceContext();

      expect(retrieved.traceId).toBe('test-trace-123');
      expect(retrieved.spanId).toBe('test-span-456');
    });

    it('should return default context when none is set', () => {
      const context = getTraceContext();

      expect(context.traceId).toBe('unknown');
      expect(context.spanId).toBe('unknown');
    });

    it('should include parentSpanId when provided', () => {
      const context: TraceContext = {
        traceId: 'trace-1',
        spanId: 'span-1',
        parentSpanId: 'parent-span-1',
      };

      setTraceContext(context);
      const retrieved = getTraceContext();

      expect(retrieved.parentSpanId).toBe('parent-span-1');
    });
  });

  describe('runInTraceContext', () => {
    it('should execute function with specified trace context', () => {
      const context: TraceContext = {
        traceId: 'scoped-trace',
        spanId: 'scoped-span',
      };

      const result = runInTraceContext(context, () => {
        const retrieved = getTraceContext();
        return retrieved.traceId;
      });

      expect(result).toBe('scoped-trace');
    });

    it('should isolate context from outer scope', () => {
      setTraceContext({ traceId: 'outer', spanId: 'outer-span' });

      runInTraceContext({ traceId: 'inner', spanId: 'inner-span' }, () => {
        const inner = getTraceContext();
        expect(inner.traceId).toBe('inner');
      });

      const outer = getTraceContext();
      expect(outer.traceId).toBe('outer');
    });

    it('should return function result', () => {
      const context: TraceContext = {
        traceId: 'test',
        spanId: 'test',
      };

      const result = runInTraceContext(context, () => {
        return { computed: 42 };
      });

      expect(result).toEqual({ computed: 42 });
    });
  });

  describe('runInTraceContextAsync', () => {
    it('should execute async function with specified trace context', async () => {
      const context: TraceContext = {
        traceId: 'async-trace',
        spanId: 'async-span',
      };

      const result = await runInTraceContextAsync(context, async () => {
        const retrieved = getTraceContext();
        return retrieved.traceId;
      });

      expect(result).toBe('async-trace');
    });

    it('should maintain context across async operations', async () => {
      const context: TraceContext = {
        traceId: 'async-persist',
        spanId: 'async-persist-span',
      };

      await runInTraceContextAsync(context, async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        const retrieved = getTraceContext();
        expect(retrieved.traceId).toBe('async-persist');
      });
    });

    it('should propagate errors from async function', async () => {
      const context: TraceContext = {
        traceId: 'error-trace',
        spanId: 'error-span',
      };

      await expect(
        runInTraceContextAsync(context, async () => {
          throw new Error('Test error');
        })
      ).rejects.toThrow('Test error');
    });

    it('should return promise result', async () => {
      const context: TraceContext = {
        traceId: 'test',
        spanId: 'test',
      };

      const result = await runInTraceContextAsync(context, async () => {
        return { data: 'success' };
      });

      expect(result).toEqual({ data: 'success' });
    });
  });

  describe('clearTraceContext', () => {
    it('should clear existing trace context', () => {
      setTraceContext({ traceId: 'clear-me', spanId: 'clear-span' });
      clearTraceContext();
      
      const context = getTraceContext();
      expect(context.traceId).toBe('unknown');
      expect(context.spanId).toBe('unknown');
    });
  });

  describe('Nested context scenarios', () => {
    it('should handle nested runInTraceContext calls', () => {
      const outer = { traceId: 'outer', spanId: 'outer-span' };
      const inner = { traceId: 'inner', spanId: 'inner-span' };

      runInTraceContext(outer, () => {
        expect(getTraceContext().traceId).toBe('outer');

        runInTraceContext(inner, () => {
          expect(getTraceContext().traceId).toBe('inner');
        });

        expect(getTraceContext().traceId).toBe('outer');
      });
    });

    it('should handle nested async context calls', async () => {
      const outer = { traceId: 'outer-async', spanId: 'outer-async-span' };
      const inner = { traceId: 'inner-async', spanId: 'inner-async-span' };

      await runInTraceContextAsync(outer, async () => {
        expect(getTraceContext().traceId).toBe('outer-async');

        await runInTraceContextAsync(inner, async () => {
          await new Promise((resolve) => setTimeout(resolve, 5));
          expect(getTraceContext().traceId).toBe('inner-async');
        });

        expect(getTraceContext().traceId).toBe('outer-async');
      });
    });
  });
});
