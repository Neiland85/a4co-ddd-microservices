import { TraceDecoratorOptions } from '../types';
export declare function Trace(options?: TraceDecoratorOptions): (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Log(level?: 'debug' | 'info' | 'warn' | 'error'): (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function CommandHandler(commandName: string, aggregateName: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function EventHandler(eventName: string, aggregateName: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Metrics(metricName: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function CacheableWithObservability(ttl?: number): (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Repository(aggregateName: string): (constructor: Function) => any;
//# sourceMappingURL=index.d.ts.map