interface SecurityEvent {
    id: string;
    type: 'login_attempt' | 'suspicious_activity' | 'rate_limit_exceeded' | 'malicious_request';
    severity: 'low' | 'medium' | 'high' | 'critical';
    source: string;
    userAgent?: string;
    userId?: string;
    details: Record<string, any>;
    timestamp: Date;
    blocked: boolean;
}
export declare class IntrusionDetectionSystem {
    private events;
    private blockedIPs;
    private suspiciousIPs;
    private threatPatterns;
    logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'blocked'>): SecurityEvent;
    private generateId;
    private analyzeThreats;
    private executeAction;
    blockIP(ip: string, duration?: number): void;
    isIPBlocked(ip: string): boolean;
    getRecentEvents(ip: string, type?: SecurityEvent['type'], timeWindow?: number): SecurityEvent[];
    private getSeverityLevel;
    private sendSecurityAlert;
    getSecurityStats(timeWindow?: number): {
        totalEvents: number;
        eventsByType: Record<string, number>;
        eventsBySeverity: Record<string, number>;
        blockedIPs: number;
        topThreats: Array<{
            ip: string;
            events: number;
        }>;
    };
}
export declare const intrusionDetection: IntrusionDetectionSystem;
export {};
//# sourceMappingURL=intrusion-detection.d.ts.map