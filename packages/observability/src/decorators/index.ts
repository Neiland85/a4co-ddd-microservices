import { type DDDMetadata } from '../types';

export function Repository(aggregateName: string): (constructor: unknown) => unknown {
  return function (constructor: unknown): unknown {
    // Implementación del decorador
    return constructor;
  };
}
