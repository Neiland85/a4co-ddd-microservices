import { type DDDMetadata } from '../types';

export function Repository(aggregateName: string): (constructor: unknown) => unknown {
  return function (constructor: unknown): unknown {
    // Implementación del decorador
    return constructor;
  };
}

// Export tracing decorators
export { Tracing, TraceDDD } from './tracing.decorator';
export type { TracingOptions } from './tracing.decorator';

// Export logging decorators
export { Log, LogDDD } from './logging.decorator';
export type { LogOptions } from './logging.decorator';
