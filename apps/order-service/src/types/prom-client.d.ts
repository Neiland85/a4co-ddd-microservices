declare module 'prom-client' {
  export interface MetricConfiguration<T extends string = string> {
    name: string;
    help: string;
    labelNames?: T[];
    buckets?: number[];
    registers?: Registry[];
  }

  export class Counter<T extends string = string> {
    constructor(configuration: MetricConfiguration<T>);
    inc(labels?: Record<T, string> | number, value?: number): void;
    labels(...labelValues: string[]): Counter<T>;
    readonly hashMap: Record<string, { value: number }>;
  }

  export class Histogram<T extends string = string> {
    constructor(configuration: MetricConfiguration<T>);
    observe(labels: Record<T, string> | number, value?: number): void;
    startTimer(labels?: Record<T, string>): () => void;
  }

  export class Gauge<T extends string = string> {
    constructor(configuration: MetricConfiguration<T>);
    set(value: number): void;
    set(labels: Record<T, string>, value: number): void;
    inc(labels?: Record<T, string>, value?: number): void;
    dec(labels?: Record<T, string>, value?: number): void;
    labels(...labelValues: string[]): Gauge<T>;
  }

  export class Registry {
    metrics(): Promise<string> | string;
    registerMetric(metric: Counter | Histogram | Gauge): void;
  }

  export const register: Registry;
  export function collectDefaultMetrics(options?: { timeout?: number; register?: Registry }): void;
}
