export interface ExpressRequest {
    ip?: string;
    hostname?: string;
    headers: Record<string, string | string[]>;
    method: string;
    url: string;
}
export interface ExpressResponse {
    setHeader(name: string, value: string): void;
    status(code: number): ExpressResponse;
    send(body: any): void;
}
export interface KoaContext {
    ip?: string;
    hostname?: string;
    headers: Record<string, string | string[]>;
    method: string;
    url: string;
    set(key: string, value: string): void;
    status: number;
    body: any;
}
export interface VitePlugin {
    name: string;
    configureServer?: (server: any) => void;
}
export declare class DevServerProtector {
    private validator;
    constructor();
    createExpressMiddleware(): (req: ExpressRequest, res: ExpressResponse, next: () => void) => void;
    createKoaMiddleware(): (ctx: KoaContext, next: () => Promise<void>) => Promise<void>;
    createVitePlugin(): VitePlugin;
    private isSuspiciousRequest;
    private isExternalIp;
    private addSecurityHeaders;
}
//# sourceMappingURL=dev-server-protector.d.ts.map