import { ObservabilityContext } from '../types';
export declare function setContext(ctx: ObservabilityContext): void;
export declare function getContext(): ObservabilityContext | undefined;
export declare function runWithContext<T>(ctx: ObservabilityContext, fn: () => T): T;
export declare function createContextFromSpan(span?: any): ObservabilityContext;
export declare function mergeContext(base: ObservabilityContext, ...contexts: Partial<ObservabilityContext>[]): ObservabilityContext;
export declare function withObservabilityContext<T extends (...args: any[]) => any>(fn: T, ctx?: ObservabilityContext): T;
export declare function extractContextFromHeaders(headers: Record<string, string | string[] | undefined>): ObservabilityContext;
export declare function injectContextToHeaders(ctx: ObservabilityContext, headers?: Record<string, string>): Record<string, string>;
export declare function createNatsContext(message: any): ObservabilityContext;
export declare function injectNatsContext(ctx: ObservabilityContext, message: any): void;
//# sourceMappingURL=index.d.ts.map