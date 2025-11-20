import { PathValidationResult, StaticFileConfig } from '../validators/vite-static-path.validator';
export interface ViteStaticFileRequest {
    url: string;
    method: string;
    headers: Record<string, string>;
}
export interface ViteStaticFileResponse {
    status: number;
    headers: Record<string, string>;
    body?: string;
}
export interface ProtectionStats {
    totalRequests: number;
    blockedRequests: number;
    allowedRequests: number;
    sensitiveFileBlocks: number;
    traversalAttempts: number;
    lastBlockedPath?: string;
    lastBlockedTime?: number;
}
export declare class ViteStaticFileProtector {
    private config;
    private stats;
    constructor(config?: Partial<StaticFileConfig>);
    protect(request: ViteStaticFileRequest, context?: string): Promise<{
        allowed: boolean;
        response?: ViteStaticFileResponse;
        validation: PathValidationResult;
    }>;
    middleware(): (req: ViteStaticFileRequest, res: any, next: () => void) => Promise<void>;
    expressMiddleware(): (req: any, res: any, next: () => void) => Promise<void>;
    getStats(): ProtectionStats;
    resetStats(): void;
    updateConfig(newConfig: Partial<StaticFileConfig>): void;
    private extractPathFromUrl;
}
//# sourceMappingURL=vite-static-file-protector.d.ts.map