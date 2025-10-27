'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DashboardMetrics } from './types';

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    monitor: {
      activeUsers: 1247,
      totalVisits: 8934,
      clickRate: 3.2,
      conversionRate: 2.8,
      userGrowth: 15.3,
      activityLevel: 'high',
    },
    recommendations: {
      sentOffers: 0,
      targetUsers: 2800,
      conversionRate: 12.1,
      roi: 340,
      campaignActivity: 'active',
    },
    comments: {
      averageRating: 4.2,
      totalComments: 156,
      verifiedComments: 89,
      sentiment: 'positive',
      engagementLevel: 78,
    },
    settings: {
      activeConfigurations: 12,
      systemHealth: 95,
      userSatisfaction: 87,
      stabilityIndex: 'optimal',
    },
  });

  // Función optimizada para determinar nivel de actividad
  const determineActivityLevel = useCallback(
    (activeUsers: number): 'low' | 'medium' | 'high' | 'critical' => {
      if (activeUsers > 1500) return 'critical';
      if (activeUsers > 1200) return 'high';
      if (activeUsers > 900) return 'medium';
      return 'low';
    },
<<<<<<< HEAD
    [],
=======
    []
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Función optimizada para determinar actividad de campaña
  const determineCampaignActivity = useCallback(
    (sentOffers: number): 'inactive' | 'active' | 'high' | 'peak' => {
      if (sentOffers > 15) return 'peak';
      if (sentOffers > 8) return 'high';
      if (sentOffers > 3) return 'active';
      return 'inactive';
    },
<<<<<<< HEAD
    [],
=======
    []
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Función optimizada para determinar sentimiento
  const determineSentiment = useCallback(
    (averageRating: number): 'negative' | 'neutral' | 'positive' | 'excellent' => {
      if (averageRating >= 4.5) return 'excellent';
      if (averageRating >= 3.5) return 'positive';
      if (averageRating >= 2.5) return 'neutral';
      return 'negative';
    },
<<<<<<< HEAD
    [],
=======
    []
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Función optimizada para determinar estabilidad del sistema
  const determineStabilityIndex = useCallback(
    (systemHealth: number): 'unstable' | 'stable' | 'optimal' => {
      if (systemHealth > 90) return 'optimal';
      if (systemHealth > 80) return 'stable';
      return 'unstable';
    },
<<<<<<< HEAD
    [],
=======
    []
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Función optimizada para actualizar métricas
  const updateMetrics = useCallback(
    (prev: DashboardMetrics): DashboardMetrics => {
      const newActiveUsers = Math.max(
        800,
<<<<<<< HEAD
        prev.monitor.activeUsers + Math.floor(Math.random() * 20 - 10),
=======
        prev.monitor.activeUsers + Math.floor(Math.random() * 20 - 10)
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      );
      const newTotalVisits = prev.monitor.totalVisits + Math.floor(Math.random() * 8);
      const newClickRate = Math.max(1, prev.monitor.clickRate + (Math.random() * 0.4 - 0.2));
      const newConversionRate = Math.max(
        1,
<<<<<<< HEAD
        prev.monitor.conversionRate + (Math.random() * 0.2 - 0.1),
=======
        prev.monitor.conversionRate + (Math.random() * 0.2 - 0.1)
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      );

      const activityLevel = determineActivityLevel(newActiveUsers);
      const campaignActivity = determineCampaignActivity(prev.recommendations.sentOffers);
      const sentiment = determineSentiment(prev.comments.averageRating);

      return {
        monitor: {
          ...prev.monitor,
          activeUsers: newActiveUsers,
          totalVisits: newTotalVisits,
          clickRate: newClickRate,
          conversionRate: newConversionRate,
          userGrowth: Math.max(0, prev.monitor.userGrowth + (Math.random() * 2 - 1)),
          activityLevel,
        },
        recommendations: {
          ...prev.recommendations,
          campaignActivity,
          conversionRate: Math.max(
            5,
<<<<<<< HEAD
            prev.recommendations.conversionRate + (Math.random() * 1 - 0.5),
=======
            prev.recommendations.conversionRate + (Math.random() * 1 - 0.5)
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
          ),
          roi: Math.max(200, prev.recommendations.roi + Math.floor(Math.random() * 20 - 10)),
        },
        comments: {
          ...prev.comments,
          averageRating: Math.max(
            1,
<<<<<<< HEAD
            Math.min(5, prev.comments.averageRating + (Math.random() * 0.2 - 0.1)),
=======
            Math.min(5, prev.comments.averageRating + (Math.random() * 0.2 - 0.1))
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
          ),
          sentiment,
          engagementLevel: Math.max(
            0,
<<<<<<< HEAD
            Math.min(100, prev.comments.engagementLevel + Math.floor(Math.random() * 6 - 3)),
=======
            Math.min(100, prev.comments.engagementLevel + Math.floor(Math.random() * 6 - 3))
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
          ),
        },
        settings: {
          ...prev.settings,
          systemHealth: Math.max(
            70,
<<<<<<< HEAD
            Math.min(100, prev.settings.systemHealth + Math.floor(Math.random() * 4 - 2)),
          ),
          userSatisfaction: Math.max(
            60,
            Math.min(100, prev.settings.userSatisfaction + Math.floor(Math.random() * 4 - 2)),
=======
            Math.min(100, prev.settings.systemHealth + Math.floor(Math.random() * 4 - 2))
          ),
          userSatisfaction: Math.max(
            60,
            Math.min(100, prev.settings.userSatisfaction + Math.floor(Math.random() * 4 - 2))
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
          ),
          stabilityIndex: determineStabilityIndex(prev.settings.systemHealth),
        },
      };
    },
<<<<<<< HEAD
    [determineActivityLevel, determineCampaignActivity, determineSentiment, determineStabilityIndex],
=======
    [determineActivityLevel, determineCampaignActivity, determineSentiment, determineStabilityIndex]
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Simulación de métricas en tiempo real optimizada
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(updateMetrics);
    }, 3000);

    return () => clearInterval(interval);
  }, [updateMetrics]);

  // Métricas memoizadas para evitar recálculos innecesarios
  const memoizedMetrics = useMemo(() => metrics, [metrics]);

  return memoizedMetrics;
}
