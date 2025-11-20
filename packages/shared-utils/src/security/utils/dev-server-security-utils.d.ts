export interface ViteConfig {
    server?: {
        host?: string;
        port?: number;
        cors?: boolean | {
            origin?: string | string[];
            credentials?: boolean;
        };
        headers?: Record<string, string>;
    };
}
export interface NextConfig {
    headers?: () => Array<{
        source: string;
        headers: Array<{
            key: string;
            value: string;
        }>;
    }>;
}
export declare class DevServerSecurityUtils {
    generateSecureViteConfig(): ViteConfig;
    generateSecureNextConfig(): NextConfig;
    generateSecureEsbuildConfig(): any;
    generateSecureHeaders(): Record<string, string>;
    generateSecureEnvVars(): Record<string, string>;
    sanitizeHost(host: string): string;
    sanitizePort(port: number): number;
}
//# sourceMappingURL=dev-server-security-utils.d.ts.map