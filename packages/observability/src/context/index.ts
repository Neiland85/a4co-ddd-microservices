import { AsyncLocalStorage } from 'async_hooks';
import React from 'react';
import type { ObservabilityContext } from '../types';

const asyncLocalStorage = new AsyncLocalStorage<ObservabilityContext>();

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement(React.Fragment, null, children);
};

/**
 * Get the current observability context from AsyncLocalStorage
 */
export function getCurrentContext(): ObservabilityContext | undefined {
  return asyncLocalStorage.getStore();
}

/**
 * Run a function within a specific observability context
 */
export function runInContext<T>(context: ObservabilityContext, fn: () => T): T {
  return asyncLocalStorage.run(context, fn);
}

/**
 * Run an async function within a specific observability context
 */
export async function runInContextAsync<T>(
  context: ObservabilityContext,
  fn: () => Promise<T>
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    asyncLocalStorage.run(context, async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Create a NATS-specific observability context
 */
export function createNatsContext(subject: string, messageId?: string): ObservabilityContext {
  const context: ObservabilityContext = {
    metadata: {
      'messaging.system': 'nats',
      'messaging.destination': subject,
      'messaging.operation': 'consume',
    },
  };

  if (messageId) {
    context.correlationId = messageId;
  }

  return context;
}
