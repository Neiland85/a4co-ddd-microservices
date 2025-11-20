import { StaticFileConfig } from '../validators/vite-static-path.validator';
export interface ViteStaticServerOptions extends StaticFileConfig {
    root?: string;
    enableProtection?: boolean;
    logAccess?: boolean;
    customValidator?: (path: string) => boolean;
}
export interface FileServeResult {
    allowed: boolean;
    path?: string;
    error?: string;
    blockedReason?: string;
}
export declare class SafeViteStaticServer {
    private protector;
    private options;
    private root;
    constructor(options?: Partial<ViteStaticServerOptions>);
    serveFile(url: string, method?: string, headers?: Record<string, string>): Promise<FileServeResult>;
    isPathSafe(path: string): boolean;
    validatePath(path: string): import("../validators/vite-static-path.validator").PathValidationResult;
    getViteConfig(): any;
    createExpressMiddleware(): (req: any, res: any, next: () => void) => Promise<void>;
    createVitePlugin(): {
        name: string;
        configureServer(server: any): void;
        config(): any;
    };
    getStats(): import("../middleware/vite-static-file-protector").ProtectionStats;
    updateConfig(newOptions: Partial<ViteStaticServerOptions>): void;
    private resolvePath;
}
export declare function createSafeViteStaticServer(options?: ViteStaticServerOptions): SafeViteStaticServer;
export declare function createSecureVitePlugin(options?: ViteStaticServerOptions): {
    name: string;
    configureServer(server: any): void;
    config(): any;
};
export declare function createSecureExpressMiddleware(options?: ViteStaticServerOptions): (req: any, res: any, next: () => void) => Promise<void>;
//# sourceMappingURL=safe-vite-static-server.d.ts.map