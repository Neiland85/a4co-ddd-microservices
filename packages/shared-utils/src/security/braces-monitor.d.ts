import { EventEmitter } from 'events';
export interface BracesSecurityAlert {
    id: string;
    timestamp: Date;
    service: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    type: 'EXPANSION_ATTACK' | 'RESOURCE_EXHAUSTION' | 'PATTERN_VIOLATION';
    details: {
        expression?: string;
        expansionSize?: number;
        processingTime?: number;
        memoryUsage?: number;
        clientIP?: string;
        userAgent?: string;
        endpoint?: string;
    };
    metadata: Record<string, any>;
}
export interface BracesSecurityMetrics {
    totalRequests: number;
    blockedRequests: number;
    averageProcessingTime: number;
    peakMemoryUsage: number;
    alertsTriggered: number;
    lastAlertTime?: Date;
    topBlockedPatterns: Array<{
        pattern: string;
        count: number;
        lastSeen: Date;
    }>;
}
export declare class BracesSecurityMonitor extends EventEmitter {
    private serviceName;
    private logger;
    private metrics;
    private alerts;
    private patternStats;
    constructor(serviceName: string);
    recordRequest(processingTime: number, memoryUsage: number, blocked?: boolean): void;
    recordAttack(type: BracesSecurityAlert['type'], severity: BracesSecurityAlert['severity'], details: BracesSecurityAlert['details'], metadata?: Record<string, any>): void;
    getMetrics(): BracesSecurityMetrics;
    getRecentAlerts(limit?: number): BracesSecurityAlert[];
    getAlertStats(): Record<string, number>;
    resetMetrics(): void;
    private setupEventHandlers;
    private handleExternalAlert;
    private handleCriticalAlert;
    private updatePatternStats;
    private generateAlertId;
}
export declare const globalBracesMonitor: BracesSecurityMonitor;
export declare class BracesSecurityMonitorFactory {
    private static monitors;
    static getMonitor(serviceName: string): BracesSecurityMonitor;
    static getAllMonitors(): Map<string, BracesSecurityMonitor>;
    static getGlobalMetrics(): BracesSecurityMetrics;
}
