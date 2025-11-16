/**
 * useIdempotent Hook - Prevents duplicate API calls
 * Ensures operations like raffle participation only happen once
 */

import { useState, useCallback, useRef } from 'react';

export interface UseIdempotentOptions {
  keyGenerator?: (...args: unknown[]) => string;
  timeout?: number; // Time in ms to keep request in processing state
}

export interface UseIdempotentReturn<T extends (...args: any[]) => Promise<any>> {
  execute: (...args: Parameters<T>) => Promise<ReturnType<T> | null>;
  isProcessing: boolean;
  isProcessingKey: (key: string) => boolean;
  clear: () => void;
}

/**
 * Hook to ensure idempotent operations
 * Prevents duplicate API calls while one is in progress
 * 
 * @example
 * ```tsx
 * const participateInRaffle = async (raffleId: string) => {
 *   return api.post(`/raffles/${raffleId}/participate`);
 * };
 * 
 * const { execute, isProcessing } = useIdempotent(participateInRaffle);
 * 
 * <button 
 *   onClick={() => execute(raffleId)} 
 *   disabled={isProcessing}
 * >
 *   Participate
 * </button>
 * ```
 */
export function useIdempotent<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: UseIdempotentOptions = {}
): UseIdempotentReturn<T> {
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const defaultKeyGenerator = (...args: unknown[]) => 
    JSON.stringify(args);

  const keyGenerator = options.keyGenerator || defaultKeyGenerator;

  const execute = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
      // Generate unique key for this operation
      const key = keyGenerator(...args);

      // Check if already processing
      if (processingRef.current.has(key)) {
        console.warn('[useIdempotent] Request already in progress:', key);
        return null;
      }

      // Mark as processing
      processingRef.current.add(key);
      setIsProcessing(true);

      try {
        // Execute the function
        const result = await fn(...args);

        return result;
      } catch (error) {
        // Re-throw to allow caller to handle
        throw error;
      } finally {
        // Clean up after timeout or immediately
        const timeout = options.timeout || 0;
        
        if (timeout > 0) {
          const timeoutId = setTimeout(() => {
            processingRef.current.delete(key);
            timeoutRef.current.delete(key);
            
            if (processingRef.current.size === 0) {
              setIsProcessing(false);
            }
          }, timeout);

          timeoutRef.current.set(key, timeoutId);
        } else {
          processingRef.current.delete(key);
          
          if (processingRef.current.size === 0) {
            setIsProcessing(false);
          }
        }
      }
    },
    [fn, keyGenerator, options.timeout]
  );

  const isProcessingKey = useCallback((key: string) => {
    return processingRef.current.has(key);
  }, []);

  const clear = useCallback(() => {
    // Clear all timeouts
    timeoutRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutRef.current.clear();
    
    // Clear processing set
    processingRef.current.clear();
    setIsProcessing(false);
  }, []);

  return { execute, isProcessing, isProcessingKey, clear };
}

/**
 * Hook for debounced idempotent operations
 */
export function useDebouncedIdempotent<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number = 300,
  options: UseIdempotentOptions = {}
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { execute, isProcessing, clear } = useIdempotent(fn, options);

  const debouncedExecute = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      return new Promise<ReturnType<T> | null>((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            const result = await execute(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    },
    [execute, delay]
  );

  return {
    execute: debouncedExecute,
    isProcessing,
    clear: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clear();
    },
  };
}
