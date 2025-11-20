export interface ApiRequest<T = any> {
    data: T;
    headers?: Record<string, string>;
    correlationId?: string;
    timestamp: Date;
}
export interface ApiError {
    code: string;
    message: string;
    details?: any;
    timestamp: Date;
    correlationId?: string;
}
export interface ServiceResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ApiError;
    metadata?: {
        service: string;
        version: string;
        timestamp: Date;
        processingTime: number;
    };
}
export interface HealthCheckResponse {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: Date;
    service: string;
    version: string;
    checks: {
        database: boolean;
        redis: boolean;
        nats: boolean;
        externalServices: Record<string, boolean>;
    };
    uptime: number;
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
}
export interface MetricsResponse {
    service: string;
    timestamp: Date;
    metrics: {
        requests: {
            total: number;
            successful: number;
            failed: number;
            rate: number;
        };
        performance: {
            averageResponseTime: number;
            p95ResponseTime: number;
            p99ResponseTime: number;
        };
        errors: {
            total: number;
            byType: Record<string, number>;
        };
    };
}
//# sourceMappingURL=api-types.d.ts.map