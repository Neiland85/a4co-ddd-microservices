import { AsyncLocalStorage } from 'async_hooks';

/**
 * Interface for trace context stored in AsyncLocalStorage
 */
export interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
}

/**
 * AsyncLocalStorage instance for storing trace context
 */
const traceContextStorage = new AsyncLocalStorage<TraceContext>();

/**
 * Set the trace context for the current async operation
 * Uses AsyncLocalStorage.enterWith() for immediate context setting
 * 
 * @param context - The trace context to set
 */
export function setTraceContext(context: TraceContext): void {
  traceContextStorage.enterWith(context);
}

/**
 * Get the current trace context from AsyncLocalStorage
 * Returns a default context if no context is set
 * 
 * @returns The current trace context or a default with 'unknown' values
 */
export function getTraceContext(): TraceContext {
  return traceContextStorage.getStore() || {
    traceId: 'unknown',
    spanId: 'unknown',
  };
}

/**
 * Run a function within a specific trace context
 * Uses AsyncLocalStorage.run() for scoped context execution
 * 
 * @param context - The trace context to use
 * @param fn - The function to execute within the context
 * @returns The result of the function execution
 */
export function runInTraceContext<T>(context: TraceContext, fn: () => T): T {
  return traceContextStorage.run(context, fn);
}

/**
 * Run an async function within a specific trace context
 * 
 * @param context - The trace context to use
 * @param fn - The async function to execute within the context
 * @returns A promise that resolves with the function result
 */
export async function runInTraceContextAsync<T>(
  context: TraceContext,
  fn: () => Promise<T>
): Promise<T> {
  return traceContextStorage.run(context, fn);
}

/**
 * Clear the current trace context
 * Useful for testing or cleanup scenarios
 */
export function clearTraceContext(): void {
  traceContextStorage.enterWith(undefined as any);
}
