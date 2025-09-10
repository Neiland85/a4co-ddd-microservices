import { NextResponse } from 'next/server';
export declare function GET(): Promise<NextResponse<{
    performance: {
        responseTime: number;
        cpuUsage: number;
        memoryUsage: number;
        networkLatency: number;
    };
    security: {
        threatsDetected: number;
        blockedAttacks: number;
        activeMonitoring: boolean;
        lastScan: string;
    };
    users: {
        activeUsers: number;
        totalUsers: number;
        bannedUsers: number;
        moderators: number;
    };
    system: {
        uptime: string;
        version: string;
        lastUpdate: string;
        status: string;
    };
}>>;
//# sourceMappingURL=route.d.ts.map