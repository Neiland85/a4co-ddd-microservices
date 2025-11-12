export * from './domain';
export * from './security';
export * from './types';
export declare class NatsEventBus {
    private nc;
    private logger;
    private codec;
    connect(url?: string): Promise<void>;
    publish<T>(subject: string, data: T): Promise<void>;
    subscribe<T>(subject: string, handler: (data: T) => Promise<void>): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map