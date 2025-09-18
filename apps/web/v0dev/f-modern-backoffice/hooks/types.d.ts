export interface DashboardMetrics {
    monitor: {
        activeUsers: number;
        totalVisits: number;
        clickRate: number;
        conversionRate: number;
        userGrowth: number;
        activityLevel: 'low' | 'medium' | 'high' | 'critical';
    };
    recommendations: {
        sentOffers: number;
        targetUsers: number;
        conversionRate: number;
        roi: number;
        campaignActivity: 'inactive' | 'active' | 'high' | 'peak';
    };
    comments: {
        averageRating: number;
        totalComments: number;
        verifiedComments: number;
        sentiment: 'negative' | 'neutral' | 'positive' | 'excellent';
        engagementLevel: number;
    };
    settings: {
        activeConfigurations: number;
        systemHealth: number;
        userSatisfaction: number;
        stabilityIndex: 'unstable' | 'stable' | 'optimal';
    };
}
//# sourceMappingURL=types.d.ts.map